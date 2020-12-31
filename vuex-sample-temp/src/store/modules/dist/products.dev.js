"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var state = {
  products: [{
    id: 1,
    title: 'iPhone 11',
    price: 8000
  }, {
    id: 2,
    title: 'iPhone 12',
    price: 10000
  }]
};
var getters = {};
var mutations = {
  setProducts: function setProducts(state, payload) {
    state.products = payload;
  }
};
var actions = {};
var _default = {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;