"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = function _callee(req, res) {
  var _ref, data, html;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get('https://conduit.productionready.io/api/tags'));

        case 2:
          _ref = _context.sent;
          data = _ref.data;
          html = '<ul>';
          data.tags.forEach(function (item) {
            html += "<li>".concat(item, "</li>");
          });
          html += '</ul>';
          res.status(200).send(html);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};