const express = require("express");
const app = express();

const { calculatePriceAndDeadline } = require("./algorithm");

app.use(express.json());

app.post("/", (req, res) => {
  const { language, mimetype, count } = req.body;
  let answer;
  if (language && mimetype && count) {
    answer = calculatePriceAndDeadline(language, count, mimetype);
  } else {
    answer = { msg: "Incorrect input" };
  }
  res.json({ answer });
});

app.listen(3000, () => {
  console.log("Listening");
});
