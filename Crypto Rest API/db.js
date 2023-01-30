"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
// import mysql2, { Connection } from "mysql2/promise";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// get the client
const promise_1 = __importDefault(require("mysql2/promise"));
// eslint-disable-next-line @typescript-eslint/ban-types
function connectToDb(cb) {
    promise_1.default
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
exports.connectToDb = connectToDb;
// module.exports = { connectToDb };
