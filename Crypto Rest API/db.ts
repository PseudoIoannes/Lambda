// import mysql2, { Connection } from "mysql2/promise";
import env from "dotenv";
env.config()
// get the client
import mysql from "mysql2/promise";

// eslint-disable-next-line @typescript-eslint/ban-types
export function connectToDb(cb:Function) {
  mysql
    .createConnection({
      host: "localhost",
      user: "root",
      database: "crypto",
      password: [process.env.password].toString(),
    })
    .then((connection) => {
      cb(connection);
      console.log("OK");
    })
    .catch((e) => console.log(e));
}

// module.exports = { connectToDb };
