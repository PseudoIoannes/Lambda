function URLValidator(req, res, next) {
  const url = req.body.url;
  try {
    new URL(url);
    next();
  } catch (err) {
    res.json({ msg: err.message + ", maybe you forget http:// or https://?" });
  }
}

function JSONvalidator(err, req, res, next) {
  if (err instanceof SyntaxError) {
    res.json("Corrupted json");
  }
}

module.exports = { URLValidator, JSONvalidator };
