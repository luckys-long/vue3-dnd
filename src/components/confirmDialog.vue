<template>
  <el-dialog :model-value="show" :before-close="beforeClose">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <el-button :type="leftBtnType" @click="cancel">
        {{ leftText }}
      </el-button>
      <el-button :type="rightBtnType" :loading="loading" @click="confirm">
        {{ rightText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="MindConfirmDialog">
import 'element-plus/es/components/dialog/style/css';

import { ElButton, ElDialog, ElMessage } from 'element-plus';
import { ref } from 'vue';

type Props = {
  show: boolean;
  leftText?: string;
  rightText?: string;
  closeOnBtn?: boolean;
  rightBtnType?: 'default' | 'primary' | 'text' | 'success' | 'warning' | 'info' | 'danger';
  leftBtnType?: 'default' | 'primary' | 'text' | 'success' | 'warning' | 'info' | 'danger';
  beforeClose(): void;
  leftHandle?(): void;
  rightHandle?(): void;
};
const props = withDefaults(defineProps<Props>(), {
  show: false,
  closeOnBtn: true,
  rightBtnType: 'primary',
  leftBtnType: 'default',
  leftText: '取消',
  rightText: '确认',
  leftHandle: () => {
    //
  },
  rightHandle: () => {
    //
  },
});

const loading = ref(false);
const confirm = () => {
  loading.value = true;
  try {
    props.rightHandle();
    loading.value = false;
    if (props.closeOnBtn) {
      props.beforeClose();
    }
    ElMessage({
      message: '保存成功',
      type: 'success',
    });
  } catch (err) {
    loading.value = false;
    ElMessage({
      message: err.message,
      type: 'error',
    });
  }
};
const cancel = () => {
  props.leftHandle();
  if (props.closeOnBtn) {
    props.beforeClose();
  }
};
</script>
