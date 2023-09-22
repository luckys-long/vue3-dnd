<template>
  <div id="layout">
    <TopBar />
    <div class="PageLayout">
      <SideBar />
      <MainApp />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from "./components/header.vue";
import MainApp from "./components/mainApp.vue";
import SideBar from "./components/sideBar.vue";

</script>

<style lang="scss">
#layout {
  background: #f4f5f7;
}
.PageLayout {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
}
</style>
