const jwt = require("jwt-simple");
let secret = process.env.SECRET; //secret env

function jwtReg(id) {
  return jwt.encode({ id }, secret);
}

function jwtAuth(token) {
  try {
    let decode = jwt.decode(token, secret);
    return decode.id;
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  jwtReg: jwtReg,
  jwtAuth: jwtAuth,
};
