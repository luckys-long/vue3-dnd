<template>
  <div class="breadcrumb-wrap">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in list" :to="{ path: item.path }">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <router-view />
</template>

<script setup>
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";

const route = useRoute();
const list = ref([]);

onMounted(() => {
  let matched = route.matched; //获取菜单对应的路由信息
  list.value = matched;
});

watch(
  () => route.matched,
  (newVal, oldVal) => {
    let matched = newVal;
    list.value = matched; //更新路由菜单数组
  }
);
</script>

<style lang="scss">
.breadcrumb-wrap {
  @include flex-align-center;
  height: 52px;
  font-weight: 700;
  color: #323233;
  background-color: #eceeef;
  padding: 0 20px;

  .el-breadcrumb {
    font-size: 16px;
  }
}
</style>
