import env from "dotenv";
env.config()

import mysql, {Connection, Pool} from 'mysql2/promise';

let connection:Pool
export async function connectToDb() {
 connection = mysql
    .createPool({
      host: process.env.host,
       user: process.env.user,
      database: process.env.database,
      password: [process.env.password].toString(),
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0
    })
      await connection.execute(
        `CREATE DATABASE IF NOT EXISTS crypto; `
      );
  
      console.log("from db", Boolean(connection));
    
}
export {connection}
