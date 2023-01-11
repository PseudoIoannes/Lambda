// let COUNTER = 100;
const express = require("express");
const { connectToDb, getDb } = require("./db");
let urlformat = require("url");

const app = express();

const { URLValidator, JSONvalidator } = require("./middlewares");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(JSONvalidator);

let db;
connectToDb((err) => {
  if (!err) {
    console.log("Successfully connected to db");
    db = getDb();

    db.collection("counter")
      .findOne({})
      .then((counter) => {
        if (!counter) {
          db.collection("counter").insertOne({ number: 100 });
        }
      });

    app.listen(3000, () => {
      console.log("Listening...");
    });
  }
});

app.post("/", URLValidator, async (req, res) => {
  const url = req.body.url;
  const dbEntry = await db.collection("urls").findOne({ originalUrl: url });

  if (dbEntry) {
    res.json(
      urlformat.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: dbEntry.shortUrl,
      })
    );
  } else {
    let COUNTER = await db.collection("counter").findOne({});
    const shortUrl = Buffer.from(COUNTER.number.toString()).toString("base64");
    await db
      .collection("counter")
      .updateOne({}, { $set: { number: COUNTER.number + 1 } });
    await db.collection("urls").insertOne({ shortUrl, originalUrl: url });

    // let fullUrl = req.protocol + "://" + req.get("host") + "/" + shortUrl;
    res.json(
      urlformat.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: shortUrl,
      })
    );
  }
});

app.get("/:url", async (req, res) => {
  const url = req.params.url;
  const dbEntry = await db.collection("urls").findOne({ shortUrl: url });
  if (!dbEntry) {
    res.json({ msg: "This link is not in use" });
  } else {
    const originalUrl = dbEntry.originalUrl;
    res.redirect(originalUrl);
  }
});
