var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Eagles#1",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  
  
  });

  
  

  function start() {

    connection.query("SELECT item_id, product_name, department_name,price,stock_quantity FROM products", function (err,res) {
        console.log("Items for sale");
    for (var i = 0; i < res.length; i++){

        console.log("\nItem : " + res[i].item_id);
        console.log("Product : " + res[i].product_name);
        console.log("Department : " + res[i].department_name);
        console.log("Price:" + res[i].price);
        console.log("Stock Quantity : "+ res[i].stock_quantity);
        
    }
    
  });
}


inquirer.prompt([ {
  type: "list",
  name: "item_id",
  message: "Would you like to purchase an item?",
  choices: ["YES","NO"]
}]).then(answers => {
  // Use user feedback for... whatever!!
  console.log("You choose : " + answers.item_id)
  if (answers.item_id === "YES") {
      purchase();
  }else if (answers.activity === "NO") {
      postAuction();
  }

});



function purchase () {
  connection.query("SELECT item_id FROM products", function(err, res) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "What item id would you like to buy?",

        }]).then(function(answer) {
          connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: answer.id,
            },
            function (err, res) {

              if (err) throw err; 
              inquirer.prompt([
                {
                  name: "stock_quantity",
                  type: "input",
                  message: "How many items will you purchase?",
            
                }
                
              ]).then(function(newAnswer) {
              
                connection.query(
                  "UPDATE stock_quantity SET stock-quantity = stock-quantity - ? WHERE ?",  [
                    {
                      newAnswer
                    },
                    {
                      res
                    }
                  ], function error () {;
                  
                    if (err) throw err;
                      
                    console.log(newAnswer);
                    console.log(res);
                    
                    


                });
              }
              
              
            
            );
    
    });

  }); 

  });

}


    

