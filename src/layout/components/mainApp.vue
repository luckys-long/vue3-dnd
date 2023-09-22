<template>
    <div
      class="main-app"
      :class="route.meta?.navShow === false ? 'main-app-navHide' : 'main-app'"
    >
      <Breadcrumb />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  import Breadcrumb from './breadcrumb.vue';
  
  const route = useRoute();
  </script>
  
  <style scoped lang="scss">
  .main-app {
    height: 100%;
    flex: 1; // 占据屏幕剩余宽度
    position: relative;
    margin-left: 5px;
    transition: all 0.8s ease 0.5s;
    width: 98%;
    margin-right: 10px;
  }

  </style>
  