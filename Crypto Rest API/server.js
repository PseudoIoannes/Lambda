"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const prepare_1 = require("./prepare");
const middleware_1 = require("./middlewares/middleware");
const controller_1 = require("./controllers/controller");
const db_1 = require("./db");
const cron_1 = require("./cron");
const port = process.env.PORT || 3000;
async function initialization() {
    await (0, db_1.connectToDb)();
    console.log("server level connection", Boolean(db_1.connection));
    await (0, prepare_1.main)();
    (0, cron_1.schedule)();
    app.listen(port, () => console.log("listening"));
}
initialization();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", middleware_1.validateSymbol, middleware_1.validateMarket, middleware_1.validateTime, controller_1.controller);
