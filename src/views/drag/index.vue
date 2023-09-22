<template>
  <Header :isEdit="isEdit"  @handle-edit="handleEdit" ></Header>
  <div class="content">
    <Left></Left>
    <el-divider direction="vertical" style="height: 100vh;"/>
    <Right :isEdit="isEdit"></Right>
  </div>
</template>

<script setup lang="ts">
import {ElDivider} from 'element-plus'
import Header from "./components/header.vue";
import Left from "./components/left.vue";
import Right from "./components/right.vue";
import { ref,onUnmounted } from 'vue';
// import Right from '../home.vue'

const isEdit=ref(false)

const handleEdit=(val)=>{
  isEdit.value=val
}
</script>

<style lang="scss">
.content {
  display: flex;
  margin-top: 20px;
  .right-wrap {
    flex: 1;
  }
}
</style>
