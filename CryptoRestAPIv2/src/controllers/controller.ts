import { Request, Response } from 'express';

import { selectSymbol } from '../db/db.js';

const controller = async (req: Request, res: Response) => {
  const { symbol, market, time } = req.query;
  let timeForSQL: number;

  if (typeof time === 'string') {
    const extension = time.slice(-1);
    const timeAmmount = Number(time.slice(0, -1));
    timeForSQL = extension === 'h' ? timeAmmount * 60 : timeAmmount;
    console.log('timeforsql', timeForSQL);
  }

  if (typeof symbol === 'string') {
    const answer = await selectSymbol(
      symbol,
      timeForSQL!,
      market as string | undefined,
    );
    const sum = answer[0].reduce((acc, curr) => acc + Number(curr.price), 0);
    const price = answer[0].length ? sum / answer[0].length : 0;
    res.json({ price });
  }
};

export default controller;
