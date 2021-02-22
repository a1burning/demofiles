<template>
  <!-- Vue3 的模板不需要根节点 -->
  <AppHeader/>
  <!-- 子路由出口 -->
  <router-view/>
  <AppFooter/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './AppHeader.vue' // 使用了ts 需要加上模块后缀 .vue
import AppFooter from './AppFooter.vue'

export default defineComponent({
  components: {
    AppHeader,
    AppFooter
  }
})

</script>

<style>

</style>
