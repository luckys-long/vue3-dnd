<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="handleCollapse">
      <el-icon v-if="!collapse">
        <fold />
      </el-icon>
      <el-icon v-else>
        <expand />
      </el-icon>
    </div>
    <!-- 标题 -->
    <div class="logo">5G智慧物联平台</div>
    <!-- 登录者信息 -->
    <div class="header-right">
      <div class="header-user">
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="@/assets/logo.png" />
        </div>
        <!-- 用户名以及按钮信息 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon>
              <caret-bottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="user">个人信息</el-dropdown-item>
              <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  ElIcon,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import { CaretBottom, Fold, Expand } from "@element-plus/icons-vue";
import { useGlobalStore } from "@/store/global";

const router = useRouter();
const username = localStorage.getItem("username");

const collapse =computed(() => useGlobalStore().collapse);


const handleCollapse = () => {
  useGlobalStore().changeCollapse(!collapse.value);
};
const handleCommand = (command) => {
  if (command == "loginout") {
    localStorage.removeItem("username");
    router.push("/login");
  } else if (command == "user") {
    alert("跳转到个人信息");
  }
};
</script>
<style>
.header {
  position: relative;
  top: 0;
  right: 0;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  color: #fff;
  background-color: #3c8dbc;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 60px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user {
  display: flex;
  height: 60px;
  align-items: center;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>
