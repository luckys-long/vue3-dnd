<template>
  <div :class="!isCollapse ? 'app-side-bar' : 'mini-side-bar'">
    <div class="menu-box">
      <el-menu
        router
        :default-active="defaultActive"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        :collapse-transition="false"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
      >
        <sub-side :routes="routes" :rootPath="route.path"></sub-side>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { ElMenu } from "element-plus";
import { useRoute } from "vue-router";
import { useGlobalStore } from "@/store/global";
import { storeToRefs } from 'pinia';
import menu from "@/router/menu";

import subSide from "./subSide.vue";
import { pathToRegexp } from "path-to-regexp";

// const isCollapse = computed(() => useGlobalStore().collapse);
const store= useGlobalStore()
const { collapse:isCollapse } = storeToRefs(store);

const menuList = [];
Object.keys(menu).forEach((k) => menuList.push(menu[k]));

const route = useRoute();
// 菜单权限后期从接口返回
const routes = menuList;
const defaultActive = ref(route.path);

// 默认选中菜单
watch(
  () => route.fullPath,
  (newVal) => {
    const matchedMenu = menuList.find((item) => newVal.startsWith(item.path));
    const matchedSubMenu = matchedMenu.children.find(
      (item) =>
        item.path === newVal ||
        newVal.includes(item.path) ||
        pathToRegexp(`${matchedMenu.path}/${item.path}`).test(newVal.split('?')[0])
    );
    defaultActive.value = `${matchedMenu.path}/${matchedSubMenu.path}`;
  },
  {
    immediate: true,
  }
);

const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};
const check = (item) => {
  const { permission } = item.meta;
  let hasPerm = true;
  //  考虑菜单权限相关的问题
  // if (permission) {
  //   hasPerm = false;
  //   for (let i = 0; i < permission.length; i++) {
  //     if (hasPermission(permission[i])) {
  //       hasPerm = true;
  //       break;
  //     }
  //   }
  //   return hasPerm;
  // }
  return hasPerm;
};
</script>

<style lang="scss">
.app-side-bar {
  overflow-y: auto;
  min-height: calc(100vh - 60px);
  flex: 0 0 220px;
  max-width: 220px;
  min-width: 220px;
  width: 220px;
  transition: all 0.8s ;
  .menu-box {
    color: #fff;
    background: $siderBarthemeColor;
    height: 100%;
    width: 100%;
    border:none
  }
}
.mini-side-bar {
  flex: 0 0 80px;
  max-width: 80px;
  min-width: 80px;
  width: 80px;
  transition: all 0.8s;
}
</style>
