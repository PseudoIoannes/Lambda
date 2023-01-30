const { sign } = require("jsonwebtoken");
require("dotenv").config();

const createAccessToken = (data) => {
  return sign({ data }, process.env.SECRET_ACCESS, {
    expiresIn: Math.floor(Math.random() * 30) + 30, //TTL (time to live) от 30 до 60 секунд(рандомно)
  });
};

const createRefreshToken = (data) => {
  return sign({ data }, process.env.SECRET_REFRESH, {
    expiresIn: "1d",
  });
};

module.exports = { createAccessToken, createRefreshToken };
