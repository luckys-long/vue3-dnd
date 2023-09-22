<template>
  <div class="alert-warp">
    <el-alert :title="tipMessage" type="info" show-icon  v-bind="$attrs"  />
  </div>
</template>

<script setup lang="ts">
import { ElAlert } from "element-plus";

type Props = {
  tipMessage: string;
 
};
withDefaults(defineProps<Props>(), {
  tipMessage: "",
});
</script>

<style lang="scss">
.alert-warp {
  margin-bottom: 10px;
  .el-alert {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    color: rgba(0, 0, 0, 0.85);
    .el-icon {
      color: #1890ff;
    }
  }
}
</style>
