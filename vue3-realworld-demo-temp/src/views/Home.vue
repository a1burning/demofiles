<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<!--使用ts，标注lang-->
<script lang="ts">
// 里面使用 defineComponent 定义组件
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

// 里面如果使用options API选项是一样的
export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld
  },
})
</script>
