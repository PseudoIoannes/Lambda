import cron from 'node-cron';
import { symbolsOnAllEndpoints, getSymbols } from './exchanges.js';
import { insertSymbol } from './db/db.js';
// console.log(symbols);
async function populateSymbols() {
  console.log('inside populateSymbols');
  const symbols = await getSymbols(symbolsOnAllEndpoints);
  symbols.forEach((e) => {
    try {
      insertSymbol({ symbol: e[0], price: e[1], market: e[2] });
    } catch (err) {
      console.log(err);
    }
  });
}

export function schedulePopulateSymbols() {
  cron.schedule('*/5 * * * *', populateSymbols);
}
