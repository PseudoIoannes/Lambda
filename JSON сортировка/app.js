const axios = require("axios").default;

const fs = require("fs");
const readline = require("readline");
const events = require("events");
const path = require("path");

// test = {
//   firstName: "Max",
//   lastName: "Remus",
//   hobbies: ["singing", "swimming"],
//   work: "MediaDime",
//   weight: "60 kg",
//   location: {
//     country: "Lithuania",
//     zipCode: "38390",
//     city: "Lewisburg",
//     countryCode: "LT",
//     ipAddress: "219.59.74.191",
//     coordinates: {
//       x: -39.84,
//       y: 19.96,
//       isDone: false,
//     },
//   },
//   id: "id#8cf04c1b-7181-4488-b106-3436fd6a2bda",
//   age: "49",
//   email: "max.remus@opticast.com",
//   height: "166",
// };
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
  await axios
    .get(endpoint)
    .then(function (response) {
      const foundValue = findVal(response.data);
      console.log(`${endpoint} value is ${foundValue}`);
      if (foundValue) {
        values.true += 1;
      } else if (foundValue === false) {
        values.false += 1;
      } else {
        console.log(`Cannot find property on ${endpoint}`);
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
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
