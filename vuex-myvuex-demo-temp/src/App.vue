<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ $store.state.count }} <br/>
    msg: {{ $store.state.msg }}
    <h2>Getters</h2>
    <h2>reverseMsg: {{ $store.getters.reverseMsg }}</h2>
    <br/>
    <h2>Mutation</h2>
    <button @click="$store.commit('increate', 2)">Mutation</button>
    <h2>Actions</h2>
    <button @click="$store.dispatch('increateAsync',5)">Action</button>
  </div>
</template>
<script>

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
