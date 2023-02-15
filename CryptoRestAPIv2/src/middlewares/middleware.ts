import { NextFunction, Request, Response } from 'express';
import { symbolsOnAllEndpoints } from '../exchanges.js';

export const validateSymbol = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { symbol } = req.query;
  if (typeof symbol === 'undefined') {
    return res.json({ error: 'No symbol provided' });
  }
  if (typeof symbol === 'string') {
    symbol = symbol.toUpperCase();
    if (!symbolsOnAllEndpoints.includes(symbol)) {
      console.log(symbolsOnAllEndpoints, symbol);
      return res.json({ error: 'symbol not supported' });
    }
    return next();
  }
};

export const validateMarket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { market } = req.query;

  const markets = [
    'coinmarketcap',
    'coinbase',
    'kucoin',
    'coinstats',
    'coinpaprika',
  ];
  if (typeof market === 'string') {
    const normalizedMarket = market.toLowerCase();
    if (!markets.includes(normalizedMarket)) {
      return res.json({
        error: `invalid market name, try ${markets.join(', ')}`,
      });
    }
  }

  next(); // no market provided is ok
};

export const validateTime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { time } = req.query;

  if (typeof time === 'string') {
    const extension = time.slice(-1);
    const timeAmmount = Number(time.slice(0, -1));
    if (
      (extension !== 'm' && extension !== 'h')
      || Number.isNaN(timeAmmount)
      || timeAmmount === 0
    ) {
      return res.json({ error: 'Cant parse time' });
    }
    return next();
  }
  return res.json({ error: 'No time period provided' });
};
