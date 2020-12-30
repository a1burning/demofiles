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
  strict: process.env.NODE_ENV !== 'production',
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
    // 增加函数，接收两个参数
    // 第一个state状态
    // 第二个是payload载荷，payload是mutations的时候提交的额外参数，可以是对象，这里传递的是数字
    increate: function increate(state, payload) {
      state.count += payload;
    }
  },
  actions: {
    // actions中的方法有两个参数：第一个参数是context上下文，这个对象中有state，commit，getters等成员，第二个参数是payLoad
    increateAsync: function increateAsync(context, payLoad) {
      setTimeout(function () {
        context.commit('increate', payLoad);
      }, 2000);
    }
  }
});

exports["default"] = _default;