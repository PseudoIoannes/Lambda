import express, { Express, Request, Response } from 'express';
import {controller} from "./controllers/controller"
const app: Express = express();
import  { connectToDb } from "./db";
import { Connection } from "mysql2";

import {validateSymbol, validateMarket, validateTime} from "./middlewares/middleware"


let connection:Connection ;
connectToDb((e: Connection) => {
  connection = e;
  app.listen(3000,()=> console.log("listening"))
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", validateSymbol, validateMarket, validateTime, controller)

