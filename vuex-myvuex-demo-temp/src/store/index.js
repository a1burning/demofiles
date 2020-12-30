import Vue from 'vue'
import Vuex from '../myVuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'hello vue'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payLoad) {
      setTimeout(() => {
        context.commit('increate', payLoad)
      }, 2000)
    }
  }
})
