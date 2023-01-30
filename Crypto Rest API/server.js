"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controllers/controller");
const app = (0, express_1.default)();
const db_1 = require("./db");
const middleware_1 = require("./middlewares/middleware");
let connection;
(0, db_1.connectToDb)((e) => {
    connection = e;
    app.listen(3000, () => console.log("listening"));
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", middleware_1.validateSymbol, middleware_1.validateMarket, middleware_1.validateTime, controller_1.controller);
