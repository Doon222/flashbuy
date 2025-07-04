<template>
  <NavLogo/>
  <NavBar>用户登录</NavBar>
  <text>用户登录</text>
</template>

<script setup>

import NavLogo from "@/components/NavLogo.vue";
import NavBar from "@/components/NavBar.vue";
import {onLoad} from "@dcloudio/uni-app";

onLoad(()=>{
  console.log('用户登录')
})

</script>

<style lang="scss" scoped>

</style>