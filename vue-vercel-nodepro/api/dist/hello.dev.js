"use strict";

module.exports = function (req, res) {
  var _req$query$name = req.query.name,
      name = _req$query$name === void 0 ? 'World' : _req$query$name;
  res.status(200).send("Hello ".concat(name, "!"));
};