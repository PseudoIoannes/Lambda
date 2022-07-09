const fs = require("fs");
const readline = require("readline");
const events = require("events");
const path = require("path");

const dictionary = {};

async function processLineByLine(file) {
  try {
    console.time("startprocess");
    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, "files", file)),
      crlfDelay: Infinity,
    });
    console.timeEnd("startprocess");

    console.time("startline");
    rl.on("line", (line) => {
      if (!(line in dictionary)) {
        //   dictionary[line] = { files: [file] };
        dictionary[line] = { counter: 1, files: [file] };
      } else {
        dictionary[line].counter += 1;
        if (!dictionary[line].files.includes(file)) {
          dictionary[line].files.push(file);
        }
      }
    });
    console.timeEnd("startline");

    await events.once(rl, "close");
  } catch (err) {
    console.error(err);
  }
}

const loopFiles = async (dir) => {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, "files"));

    console.time("forfiles");
    for (const file of files) {
      await processLineByLine(file);
    }
    console.timeEnd("forfiles");
    let inEveryFile = 0;
    let atLeastin10Files = 0;

    for (e of Object.keys(dictionary)) {
      if (dictionary[e].files.length >= 10) {
        atLeastin10Files += 1;
        if (dictionary[e].files.length === 20) {
          inEveryFile += 1;
        }
      }
    }

    console.log(`Unique values: ${Object.keys(dictionary).length}`);
    console.log(
      `At least in 10 files ${atLeastin10Files}, in every file ${inEveryFile}`
    );
  } catch (e) {
    console.error(e);
  }
};

loopFiles();
