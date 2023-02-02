"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.connectToDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promise_1 = __importDefault(require("mysql2/promise"));
let connection;
exports.connection = connection;
async function connectToDb() {
    exports.connection = connection = promise_1.default
        .createPool({
        host: process.env.host,
        user: process.env.user,
        database: process.env.database,
        password: [process.env.password].toString(),
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0
    });
    await connection.execute(`CREATE DATABASE IF NOT EXISTS crypto; `);
    console.log("from db", Boolean(connection));
}
exports.connectToDb = connectToDb;
