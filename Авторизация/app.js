const express = require("express");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("./jwt.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { connectToDb, getDb } = require("./db");

let db;
connectToDb((err) => {
  if (!err) {
    console.log("Successfully connected to db");
    db = getDb();
    app.listen(3000, () => {
      console.log("Listening...");
    });
  }
});

app.post("/sign_up", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const user = await db.collection("users").findOne({ email: email });
      if (user) {
        res.json({ msg: "This email is already registered" });
      } else {
        const hashedPassword = await hash(password, 10);
        await db
          .collection("users")
          .insertOne({ email: email, password: hashedPassword });
        res.json({ msg: "Successfully registered a new user" });
      }
    } else {
      res.json({ msg: "email and password must not be empty" });
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.query;
  try {
    if (email && password) {
      const user = await db.collection("users").findOne({ email: email });
      if (user) {
        const isValid = compare(password, user.password);
        if (!isValid) {
          res.json({ msg: "Login unsuccessful" });
        } else {
          const accessToken = createAccessToken(user);
          const refreshToken = createRefreshToken(user); //TODO
          res.json({
            msg: "Login successful!",
            token: accessToken,
            refresh: refreshToken,
          });
        }
      } else {
        res.json({ msg: "This email is not registered" });
      }
    } else {
      res.json({ msg: "email and password query must not be empty" });
    }
  } catch (err) {
    res.json({ msg: err.message });
  }
});

app.get("/me:n", async (req, res) => {
  const token = req.header("Authorization");
  const { n } = req.params;
  try {
    if (token) {
      const tokenData = verify(token.split(" ")[1], process.env.SECRET_ACCESS);
      if (tokenData) {
        let data = tokenData.data;
        res.json({ data, request_num: n });
      }
      // res.json(token);
    } else {
      res.status(401).json({ msg: "Unauthorized: no token provided", n });
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      res.status(401).json({ msg: "Unauthorized" });
    } else {
      res.json({ msg: err.message });
    }
  }
});

app.post("/refresh", (req, res) => {
  const token = req.header("Authorization");
  try {
    if (token) {
      const tokenData = verify(token.split(" ")[1], process.env.SECRET_REFRESH);
      if (tokenData) {
        const accessToken = createAccessToken(tokenData.data);
        res.json({ accessToken });
      }
      // res.json(token);
    } else {
      res.status(401).json({
        msg: "Unauthorized: no refresh token provided",
        n: req.params.n,
      });
    }
  } catch (err) {
    res.json({ msg: err.message });
  }
});
