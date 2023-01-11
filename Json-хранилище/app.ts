import express, { Express, Request, Response } from 'express';
import { Db } from "mongodb"
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err:Error, req:Request, res:Response, next:Function) => {
  if (err instanceof SyntaxError) {
      // console.error(err);
      res.json("Corrupted json");
  }
  // next();
});

import { connectToDb, getDb } from "./db"

let db:Db;
connectToDb((err:Error) => {
  if (!err) {
    console.log("Successfully connected to db");
    db = getDb();
    app.listen(3000, () => {
      console.log("Listening...");
    });
  }
});


app.post("/:route",async (req:Request,res:Response)=>{
  const route:string = req.params.route
    const entry = await db.collection("routes").findOne({"route":route})
    if (entry){
      res.json("This route is already in use")
    }else{
      

      await db.collection("routes").insertOne({route:route, json:req.body})
      res.redirect(`/${route}`)
    }
})

app.get("/:route", async (req:Request,res:Response)=>{
  const route:string = req.params.route
    const entry = await db.collection("routes").findOne({"route":route})
    if (!entry){
      res.json("This route is not in use, maybe you have a typo?")
    }else{
      res.json(entry.json)
    }
})
