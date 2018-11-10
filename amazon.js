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
    var choiceArray = [];
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
        var itemInfo = results[i].item_name
        choiceArray.push(itemInfo);
    }

    inquirer
        .prompt([
            {
                name: 'itemList',
                type: 'list',
                message: 'Welcome! Which item would you like to buy?',
                choices: choiceArray
            }
        ]).then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_name === answer.itemList) {
                chosenItem = results[i];
                }
            }
            if (chosenItem.inventory > 0) {
                // item is in stock, so update inventory levels and let customer know
                var newInventory = chosenItem.inventory - 1;
                connection.query(
                  'UPDATE forSale SET ? WHERE ?',
                  [
                    {
                      inventory: newInventory
                    },
                    {
                      id: chosenItem.id
                    }
                  ],
                  function(error) {
                    if (error) throw err;
                    console.log('Item purchased!');
                    start();
                  }
                );
              } else {
                // item sold out, so apologize and start over
                console.log('This item is sold out! Sorry!');
                start();
              }
        });
    });
};