const fs = require("fs");
const readline = require("readline");
const events = require("events");
const path = require("path");

let db = [];
async function processLineByLine() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(
        path.join(__dirname, "IP2LOCATION-LITE-DB1.CSV")
      ),
    });

    rl.on("line", (line) => {
      db.push(line.split(",").map((e) => e.slice(1, -1)));
    });
    await events.once(rl, "close");
  } catch (err) {
    console.error(err);
  }
}
/**
 * Simple function to convert ip to its integer representation
 * @param {String} ip string representing ip adress
 * @returns {Number}  integer number representing ip adress
 */
function ipToNumber(ip) {
  ip = ip.split(".");
  ip =
    ip[0] * Math.pow(256, 3) +
    ip[1] * Math.pow(256, 2) +
    ip[2] * 256 +
    ip[3] * 1;
  return ip;
}

function findLocationByIp(number, start, end) {
  mid = Math.floor((start + end) / 2);
  if (number >= db[mid][0] && number <= db[mid][1]) {
    // console.log("FOUND", number, db[mid]);
    return mid;
  } else if (number > db[mid][0]) {
    return findLocationByIp(number, mid + 1, end);
  } else {
    return findLocationByIp(number, start, mid - 1);
  }
}

function NumberToIp(number) {
  return [
    (number >> 24) & 0xff,
    (number >> 16) & 0xff,
    (number >> 8) & 0xff,
    number & 0xff,
  ].join(".");
}

module.exports = {
  ipToNumber,
  findLocationByIp,
  processLineByLine,
  db,
  NumberToIp,
};
