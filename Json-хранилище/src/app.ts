import express, {
  Express, NextFunction, Request, Response,
} from 'express';
import { Db } from 'mongodb';

import { connectToDb, getDb } from './db';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  if (err instanceof SyntaxError) {
    // console.error(err);
    res.json('Corrupted json');
  }
  next();
});

let db:Db;
connectToDb((err:Error) => {
  if (!err) {
    console.log('Successfully connected to db');
    db = getDb();
    app.listen(3000, () => {
      console.log('Listening...');
    });
  }
});

app.post('/:route', async (req:Request, res:Response) => {
  const { route } = req.params;
  const entry = await db.collection('routes').findOne({ route });
  if (entry) {
    return res.json('This route is already in use');
  }
  await db.collection('routes').insertOne({ route, json: req.body });
  return res.redirect(`/${route}`);
});

app.get('/:route', async (req:Request, res:Response) => {
  const { route } = req.params;
  const entry = await db.collection('routes').findOne({ route });
  if (!entry) {
    return res.json('This route is not in use, maybe you have a typo?');
  }
  return res.json(entry.json);
});
