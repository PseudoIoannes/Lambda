import { MongoClient, Db } from 'mongodb';
import env from 'dotenv';

env.config();
const { mongostring } = process.env;

let dbConnection:Db;

function connectToDb(cb:Function) {
  MongoClient.connect(mongostring!)
    .then((client) => {
      dbConnection = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
      cb(err);
    });
}
function getDb():Db {
  return dbConnection;
}

export { connectToDb, getDb };
