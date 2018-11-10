var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'amazonHW_db'
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

//--------Functions--------//
function start() {
  connection.query('SELECT * FROM forSale', function(err, results) {
    if (err) throw err;
    inquirer
        .prompt({
            name: 'department',
            type: 'list',
            message:
                'Welcome! Which department would you like to shop from?',
            choices: ['CLOTHING', 'MUSIC', 'FOOD']
        })
        .then(function secondQuestion(answer) {
          // based on their answer, either call the bid or the post functions
            if (answer.department.toUpperCase() === 'CLOTHING') {
                buyItem('CLOTHING');
            } else if (answer.department.toUpperCase() === 'MUSIC') {
                buyItem('MUSIC');
            } else if (answer.department.toUpperCase() === 'FOOD') {
                buyItem('FOOD');
            }
        });
  });
};

function buyItem(chosenDepartment) {
    var choiceArray = [];
    inquirer
        .prompt({
            name: 'items',
            type: 'list',
            choices: function() {
                connection.query('SELECT * FROM forSale', function(err, results) {
                    if (err) throw err;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].department.toUpperCase() === chosenDepartment) {
                            choiceArray.push(results[i].item_name);
                        }
                    }
                    return choiceArray;
                })
            },
            message: "Which item would you like to purchase?"
        }).then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_name === answer.choice) {
                chosenItem = results[i];
                }
            }
            if (chosenItem.inventory > 0) {
                // bid was high enough, so update db, let the user know, and start over
                var newInventory = chosenItem.inventory - 1;
                connection.query(
                  'UPDATE forSale SET ? WHERE ?',
                  [
                    {
                      inventory: newInventory
                    },
                  ],
                  function(error) {
                    if (error) throw err;
                    console.log('Item purchased!');
                    start();
                  }
                );
              } else {
                // bid wasn't high enough, so apologize and start over
                console.log('This item is sold out! Sorry!');
                start();
              }
            //adjust inventory levels based on what sold
        });
}