let _Vue = null
class Store {
  // 构造函数接收一个参数是对象
  constructor (options) {
    // 这里对对象进行解构，并且赋默认值为空对象，避免没有传当前属性
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options
    // 将state属性进行响应式处理
    this.state = _Vue.observable(state)
    // 对getters属性进行处理
    // getters是一个对象，对象中有一些方法，这些方法都需要接收state参数，并且最终都有返回值，这些方法都是获取值，所以可以使用Object.defineProperty将这些方法转换成get访问器
    // 1. 先定义一个this.getters让外部可以直接访问，然后初始化成一个没有原型对象的空对象
    this.getters = Object.create(null)
    // 2. 遍历所有的getters的key，把对应的key注册到this.getters对象中，定义一个get属性，返回key对应的getters中方法的执行结果，并传入state
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })
    // 内部属性是私有属性，标识下划线_，不希望外部访问
    // 对mutations属性进行处理
    this._mutations = mutations
    // 对actions属性进行处理
    this._actions = actions
  }

  // 在commit方法中获取_mutations
  // 接收两个参数，第一个参数是type，方法名称，第二个参数是payLoad，调用方法的参数
  commit (type, payload) {
    // 通过type找到this._mutations中的方法并调用，传入参数payload
    this._mutations[type](this.state, payload)
  }

  // 在dispatch方法中获取_actions
  // 实现方式和commit一样
  dispatch (type, payload) {
    // 第一个参数是context，这里简单模拟就传入this，这个里面就有我们需要的state，commit等
    // 第二个参数是payload
    this._actions[type](this, payload)
  }
}

// install接收一个参数，Vue构造函数，后面在Store类中还要使用构造函数,所以在全局定义一个_Vue
function install (Vue) {
  _Vue = Vue
  // 1. 创建Vue实例传入的store对象注入到Vue原型上的$store，在所有组件中用this.$store都可以获取到Vuex的仓库，从而共享状态
  // 2. 这里我们获取不到Vue的实例，所以这里通过混入beforeCreate来获取Vue实例，从而拿到选项中的store对象
  _Vue.mixin({
    beforeCreate () {
      // 这里的this就是Vue的实例
      // 首先判断当前Vue的实例的options中是否有store，当创建根实例的时候，会把store注入到Vue的实例上，如果是组件实例，并没有store选项就不需要做这件事情
      if (this.$options.store) {
        // 给Vue的原型上挂载$store
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// 最后将Store类和install方法导出
export default {
  Store,
  install
}
