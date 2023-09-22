<template>
  <div class="drag-header">
    <p>山源网络拓扑图</p>
    <el-switch
      v-model="Val"
      inactive-text="编辑模式"
      @change="currentChange"
      style="margin-right: 20px"
    />
  </div>
</template>

<script setup lang="ts">
import { ElSwitch } from "element-plus";
import { ref, watch } from "vue";

type Props = {
  isEdit: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
});

const Val = ref(props.isEdit);

const emit = defineEmits(["handleEdit"]);

const currentChange = (val: boolean) => {
  emit("handleEdit", val);
};
</script>

<style lang="scss">
.drag-header {
  height: 66px;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background: #cce3fb;
  p {
    font-size: 22px;
    font-weight: bolder;
  }
  span {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
