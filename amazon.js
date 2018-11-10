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

var choiceArray = [];

function makeArray(results) {
    for (var i = 0; i < results.length; i++) {
        var itemInfo = ["Name: " + results[i].item_name + " | Department: " + results[i].department + " | Price: " + results[i].price]
        choiceArray.push(itemInfo);
    }
    return choiceArray;
}

function start() {
  connection.query('SELECT * FROM forSale', function(err, results) {
    if (err) throw err;
    makeArray(results);
    inquirer
        .prompt([
            {
                name: 'itemList',
                type: 'list',
                message: 'Welcome! Which item would you like to buy?',
                choices: choiceArray
            }
        ]).then(function(answer) {
            var chosenItem = answer.toUpperCase();
            if (results.chosenItem.inventory > 0) {
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
    });
};