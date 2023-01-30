import { Request, Response} from 'express';

import  { connectToDb } from "../db";
import { Connection } from "mysql2";

let connection:Connection ;
connectToDb((e: Connection) => {
  connection = e;
});


export const controller = async (req:Request,res:Response)=>{
  const {symbol, market, time } = req.query
  let timeForSQL:string
  
  if (typeof time === "string"){
    let extension = time.slice(-1)
  const timeAmmount = Number(time.slice(0,-1))
  
    switch (extension) {
      case 'm':
        extension = "minute"
        break;
      case 'h':
        extension = "hour"
        break;
      default:
        extension = "minute"
    }
    timeForSQL = timeAmmount+" "+extension
    console.log(timeForSQL)
  }
  
  
  
    let markets:string[] = []
   if (!market){
    markets = [
      "coinmarketcap",
      "coinbase",
      "kucoin",
      "coinstats",
      "coinpaprika",
    ];
  }else{
    markets = [market as string]
  }
    const prices: number[] = []
    for (const market of markets){
      const [rows] = await connection.execute(`SELECT    *
     FROM      ${market}_${symbol}
     WHERE added >= DATE_SUB(now(),INTERVAL ${timeForSQL!})
     ORDER BY  id DESC
     ;`);
    
     for (const e of rows){
      prices.push(Number(e.price))
     
     }
  
    }
  
    const init = 0
    
    let total = prices.reduce((acc, currVal) => acc + currVal,
    init)
    total = total / prices.length// undefined
    res.json({"data":total}) 
  
  
  }
  
 