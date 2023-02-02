import express, { Express, Request, Response } from 'express';
const app: Express = express();
import { main } from "./prepare";

import {validateSymbol, validateMarket, validateTime} from "./middlewares/middleware"
import {controller} from "./controllers/controller"
import  { connectToDb, connection } from "./db";
import { schedule } from "./cron";

const port = process.env.PORT || 3000


async function initialization(){
  await connectToDb();
  console.log("server level connection", Boolean(connection))
  await main()
  schedule()
  app.listen(port,()=> console.log("listening"))
  
}
initialization()





app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", validateSymbol, validateMarket, validateTime, controller)

