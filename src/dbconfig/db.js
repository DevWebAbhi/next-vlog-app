const mysql = require('mysql2/promise');

const MYSQL_CONNECTION_URL = process.env.MY_SQL_CONNECTION_URL;

let pool;

function createPool() {
  if(!MYSQL_CONNECTION_URL){
    throw Error("MYSQL_CONNECTION_URL Not found");
  }
  return mysql.createPool(MYSQL_CONNECTION_URL);
}

function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

async function executeQuery({ query, values }) {
  const connectionPool = getPool();
  try {
    const [results] = await connectionPool.execute(query, values);
    return results;
  } catch (error) {
    if (error.code === 'ER_CON_COUNT_ERROR') {
      throw new Error('Database has too many connections');
    } else {
      throw new Error(error);
    }
  }
}

// Function to test the connection
async function testConnection() {
  const connectionPool = getPool();
  try {
    const connection = await connectionPool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();

module.exports = { getPool, executeQuery };
