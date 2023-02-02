import { Request, Response} from 'express';

import  { connectToDb, connection } from "../db";


export const controller = async (req:Request,res:Response)=>{
  console.log("controller", Boolean(connection))
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
    if (typeof market === "string") markets = [market]
  }


    const prices: number[] = []
    for (const market of markets){
      try{
        const symbolupper = typeof symbol === "string"? symbol.toUpperCase():symbol
        const [rows] = await connection.execute(`SELECT    *
        FROM      ${market}_${symbolupper }
        WHERE added >= DATE_SUB(now(),INTERVAL ${timeForSQL!})
        ORDER BY  id DESC
        ;`);
        
        
        for (const e of rows as any){//
          prices.push(Number(e.price))
          
        }
      }catch(err){
        console.log(err)
      }

  
    }
  
    const init = 0
    
    let total = prices.reduce((acc, currVal) => acc + currVal,
    init)
    total = total / prices.length// undefined
    res.json({"data":total}) 
  
  
  }
  
 