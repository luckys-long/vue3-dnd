<template>
  <div id="app-view" style="height: 100%; overflow: hidden">
    <el-config-provider :locale="zhCn">
      <router-view />
    </el-config-provider>
</div>
</template>

<script setup >
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

</script>
<style lang="scss">
#nprogress .bar {
  background-color: $themeColor !important;
}
.search-wrap {
  margin-top: 10px;
}
</style>
