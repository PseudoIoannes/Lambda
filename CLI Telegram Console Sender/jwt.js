const jwt = require("jwt-simple");
const fs = require("fs").promises;
let { secret } = require("./.env.js"); //secret env

async function read_token() {
  try {
    let tkn = await fs.readFile("jwt_token", {
      flag: "r",
      encoding: "utf8",
    });
    return tkn;
  } catch (err) {
    if (err.errno === -4058) {
      console.log(
        "Please login before using app, seems like you dont have token file created yet :/"
      );
    } else {
      console.log(err.message);
    }
  }
}

async function write_token(token) {
  await fs.writeFile("jwt_token", `${token}`, {
    flag: "w",
  });
}

function jwt_register(id) {
  return jwt.encode({ id }, secret);
}

function jwt_auth(token) {
  try {
    let decode = jwt.decode(token, secret);
    // console.log(decode.id);
    return decode.id;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

module.exports = {
  jwt_register: jwt_register,
  jwt_auth: jwt_auth,
  read_token: read_token,
  write_token: write_token,
};
