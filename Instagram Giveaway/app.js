const fs = require("fs");
const readline = require("readline");
const events = require("events");
const path = require("path");

const dictionary = {};

async function processLineByLine(file) {
  // try {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "files", file)),
    // crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    if (!(line in dictionary)) {
      dictionary[line] = [file];
      // dictionary[line] = { counter: 1, files: [file] };
    } else {
      // dictionary[line].counter += 1;
      if (!dictionary[line].includes(file)) {
        dictionary[line].push(file);
      }
    }
  });

  await events.once(rl, "close");
  // } catch (err) {
  //   console.error(err);
  // }
}

const loopFiles = async (dir) => {
  // try {
  console.time("timer");
  const files = await fs.promises.readdir(path.join(__dirname, "files"));

  for (const file of files) {
    await processLineByLine(file);
  }

  let inEveryFile = 0;
  let atLeastin10Files = 0;

  for (e of Object.keys(dictionary)) {
    if (dictionary[e].length >= 10) {
      atLeastin10Files += 1;
      if (dictionary[e].length === 20) {
        inEveryFile += 1;
      }
    }
  }
  console.timeEnd("timer");
  console.log(`Unique values: ${Object.keys(dictionary).length}`);
  console.log(
    `At least in 10 files ${atLeastin10Files}, in every file ${inEveryFile}`
  );
  // } catch (e) {
  //   console.error(e);
  // }
};

loopFiles();
