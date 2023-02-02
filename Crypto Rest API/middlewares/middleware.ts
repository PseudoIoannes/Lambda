import fs from "fs";
import {Request, Response } from 'express';
import { onAllApiEndpoints } from "../prepare";



export const validateSymbol = async (req:Request,res:Response, next:Function)=>{

  const symbols = onAllApiEndpoints
  const {symbol} = req.query
  
if (typeof symbol === "string"){
  if (!symbols.includes(symbol.toUpperCase())){
    res.json({"error":"symbol not in db"})
  }else{ 
    next()
  }
}
  else{
    res.json({"error":"No symbol provided"}) 
}
  }


export const validateMarket = async (req:Request,res:Response, next:Function)=>{
  const {market} = req.query

      const  markets = [
        "coinmarketcap",
        "coinbase",
        "kucoin",
        "coinstats",
        "coinpaprika",
      ];
      if (typeof market === "string") {
      if (markets.includes(market)){
        next()
      }else{
        res.json({"error":"invalid market name, try coinmarketcap coinbase kucoin coinstats coinpaprika"})
      }
    }else{
      next() // no market provided is ok
    }
    }  


    export const validateTime = async (req:Request,res:Response, next:Function)=>{
      const {time } = req.query

      if (typeof time === "string"){
      const extension = time.slice(-1)
    const timeAmmount = Number(time.slice(0,-1))
      if ((extension !== "m" && extension !== "h" )|| isNaN(timeAmmount)|| timeAmmount === 0){
        res.json({"error":"Cant parse time"})
      }else{
        next()
      }

      }else{
        res.json({"error":"No time period provided"})
      }
    
    }

    