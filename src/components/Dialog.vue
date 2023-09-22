<template>
  <el-dialog :model-value="show"  >
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
    
  </el-dialog>
</template>

<script setup lang="ts">
import 'element-plus/es/components/dialog/style/css';

import { ElDialog } from 'element-plus';

type Props = {
  show: boolean;
  needFooter?: boolean;
};
withDefaults(defineProps<Props>(), {
  show: false,
  needFooter: false,
});
// const emit = defineEmits(['closed']);
// const closed = (e: any) => {
//   emit('closed', e);
// };
</script>
<style lang="scss">

</style>
