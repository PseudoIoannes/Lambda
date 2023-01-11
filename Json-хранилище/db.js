"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.connectToDb = void 0;
const mongodb_1 = require("mongodb");
let dbConnection;
function connectToDb(cb) {
    mongodb_1.MongoClient.connect("mongodb://127.0.0.1:27017/json_vault")
        .then((client) => {
        dbConnection = client.db();
        cb();
    })
        .catch((err) => {
        console.log(err);
        cb(err);
    });
}
exports.connectToDb = connectToDb;
function getDb() {
    return dbConnection;
}
exports.getDb = getDb;
