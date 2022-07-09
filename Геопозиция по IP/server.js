const express = require("express");
const {
  findLocationByIp,
  ipToNumber,
  processLineByLine,
  db,
  NumberToIp,
} = require("./app");
const app = express();
const port = process.env.PORT || 3000;
//request.socket.remoteAddress req.ip
processLineByLine();

app.get("/", (req, res) => {
  console.log(req.headers["x-forwarded-for"]);
  ip = req.headers["x-forwarded-for"];
  index = findLocationByIp(ipToNumber(ip), 0, db.length - 1);

  data = JSON.stringify({
    ip: ip,
    ipAsNum: ipToNumber(ip),
    range: db[index],
    readableRange: [NumberToIp(db[index][0]), NumberToIp(db[index][1])],
  });
  console.log(data);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
