const axios = require("axios").default;

const fs = require("fs");
const readline = require("readline");
const events = require("events");
const path = require("path");

let values = { true: 0, false: 0 };
let endpoints = [];

async function processLineByLine() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, "endpoints.txt")),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      endpoints.push(line);
      //   await getEndpointData(line);
    });

    await events.once(rl, "close");
  } catch (err) {
    console.error(err);
  }
}

async function getEndpointData(endpoint) {
  for (let attempt = 0; attempt != 3; attempt++) {
    let isSuccessful = await axios
      .get(endpoint)
      .then(function (response) {
        const foundValue = findVal(response.data);
        console.log(`${endpoint} value is ${foundValue}`);
        if (foundValue) {
          values.true += 1;
          return true;
        } else if (foundValue === false) {
          values.false += 1;
          return true;
        } else {
          console.log(`Cannot find property on ${endpoint}`);
          return false;
        }
      })
      .catch(function (error) {
        console.log(error.message);
      });
    if (isSuccessful) break;
  }
}

function findVal(data) {
  if ("isDone" in data) {
    return data.isDone;
  }

  for (let k in data) {
    if (typeof data[k] === "object" && data[k] !== null) {
      let currentAnswer = findVal(data[k]);
      if (typeof currentAnswer == "boolean") {
        return currentAnswer;
      }
    }
  }
}

(async function main() {
  await processLineByLine();
  //   console.log(endpoints);
  for (let endpoint of endpoints) {
    // console.log(endpoint);

    await getEndpointData(endpoint);
  }
  console.log(values);
})();
