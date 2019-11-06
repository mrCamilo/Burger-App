// Import MySQL connection.
var connection = require("../config/connection.js");

//code borrowed from week 14 exercise 18 catsapp


///////////////////functions/////////////////////
// Helper function for SQL syntax.
// helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  var arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Cheese Burg => 'Cheese Burg')
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      // e.g. {burger_name: 'Cheese Burg'} => ["burger_name='Cheese Burg'"]
      // e.g. {devoured: true} => ["devoured=true"]
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

///////////////end functions/////////////////////

// Object for all our SQL statement functions.
var orm = {
  //selectAll()
  selectAll: function (tableInput, cb) {
    var queryString = "SELECT * FROM " + tableInput + ";";
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result); //do something with the returned sql query result
    });
  },

  /*
  cb = function(res) {
        cb(res); //second layer function
      }*/

  //insertOne()
  insertOne: function (table, cols, vals, cb) {
    var queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    console.log(queryString);

    connection.query(queryString, vals, function (err, result) {
      if (err) {
        throw err;
      }

      cb(result); //do something with the returned sql query result
    });
  },
  //updateOne()
  // An example of objColVals would be {burger_name: delicious, devoured: true}
  updateOne: function (table, objColVals, condition, cb) {
    var queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    console.log(queryString);
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }

      cb(result); //do something with the returned sql query result
    });
  },

  //delete()
  delete: function (table, condition, cb) {
    var queryString = "DELETE FROM " + table;
    queryString += " WHERE ";
    queryString += condition;
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  }
};


// Export the orm object for the model (burgers.js).
module.exports = orm;