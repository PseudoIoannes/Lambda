import express, { Express } from 'express';
import { schedulePopulateSymbols } from './cron.js';
import controller from './controllers/controller.js';
import {
  validateSymbol,
  validateMarket,
  validateTime,
} from './middlewares/middleware.js';

const app: Express = express();

const port = process.env.PORT || 3000;

async function initialization() {
  schedulePopulateSymbols();
  app.listen(port, () => console.log('listening'));
}
initialization();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', validateSymbol, validateMarket, validateTime, controller);
