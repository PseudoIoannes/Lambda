"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        // console.error(err);
        res.json("Corrupted json");
    }
    // next();
});
const db_1 = require("./db");
let db;
(0, db_1.connectToDb)((err) => {
    if (!err) {
        console.log("Successfully connected to db");
        db = (0, db_1.getDb)();
        app.listen(3000, () => {
            console.log("Listening...");
        });
    }
});
app.post("/:route", async (req, res) => {
    const route = req.params.route;
    const entry = await db.collection("routes").findOne({ "route": route });
    if (entry) {
        res.json("This route is already in use");
    }
    else {
        await db.collection("routes").insertOne({ route: route, json: req.body });
        res.redirect(`/${route}`);
    }
});
app.get("/:route", async (req, res) => {
    const route = req.params.route;
    const entry = await db.collection("routes").findOne({ "route": route });
    if (!entry) {
        res.json("This route is not in use, maybe you have a typo?");
    }
    else {
        res.json(entry.json);
    }
});
