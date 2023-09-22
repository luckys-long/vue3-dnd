<template>
  <template v-for="(item, idx) in routes" :key="idx">
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length&&!item.meta.isHide">
      <template #title>
        <el-icon><i :class="item.meta.icon"></i> </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <subSide :routes="item.children" :rootPath="item.path"></subSide>
    </el-sub-menu>
    <el-menu-item :index="item.path" v-else-if="item.meta.isHide">
      <el-icon><i :class="item.meta.icon"></i> </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <el-menu-item :index="resolvePath(item.path)" v-else>
      <template #title>
        <el-icon><i :class="item.meta.icon"></i> </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
</template>
</template>
<script setup name="subSide">
// 递归组件，在script添加name属性，然后可以在模板中直接使用
import { ElSubMenu, ElMenuItem, ElIcon } from "element-plus";

const props = defineProps({
  rootPath: '/',
  routes: {
    type: Array,
    default: [],
  },
});
const resolvePath = (path) => `${props.rootPath}/${path}`;

</script>
