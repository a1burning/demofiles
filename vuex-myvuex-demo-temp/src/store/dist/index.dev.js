"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _myVuex = _interopRequireDefault(require("../myVuex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_myVuex["default"]);

var _default = new _myVuex["default"].Store({
  state: {
    count: 0,
    msg: 'hello vue'
  },
  getters: {
    reverseMsg: function reverseMsg(state) {
      return state.msg.split('').reverse().join('');
    }
  },
  mutations: {
    increate: function increate(state, payload) {
      state.count += payload;
    }
  },
  actions: {
    increateAsync: function increateAsync(context, payLoad) {
      setTimeout(function () {
        context.commit('increate', payLoad);
      }, 2000);
    }
  }
});

exports["default"] = _default;