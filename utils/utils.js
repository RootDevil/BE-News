const db = require('../db/connection');
const format = require('pg-format');

exports.checkResourceExists = async (table, column, value) => {
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    const queryOutput = await db.query(queryStr, [value]);
  
    if (queryOutput.rows.length === 0) {
      return Promise.reject({ 
          status: 404, 
          message: "Resource does not exist" 
      });
    }
  }