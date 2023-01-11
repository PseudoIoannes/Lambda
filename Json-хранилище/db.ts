import { MongoClient, Db } from "mongodb"
let dbConnection:Db;

  function connectToDb(cb:Function){
    MongoClient.connect("mongodb://127.0.0.1:27017/json_vault")
      .then((client) => {
        dbConnection = client.db();
        cb();
      })
      .catch((err) => {
        console.log(err);
        cb(err);
      });
  }
  function getDb():Db{
    return dbConnection
  }


export {connectToDb,getDb}