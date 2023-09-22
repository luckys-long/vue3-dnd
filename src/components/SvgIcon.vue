<template>

  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#fff'
  }
});
// 图标在 iconfont 中的名字
const iconClassName = computed(() => `#${props.iconName}`);
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `iconfont ${props.className}`;
  }
  return 'iconfont';
});
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  /* fill: currentColor; */
  vertical-align: -2px;
}
</style>
