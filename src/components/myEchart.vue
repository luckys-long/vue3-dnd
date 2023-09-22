<template>
    <div ref="echartsRef" class="echarts-wrap"></div>
  </template>
  
  <script setup lang='ts'>
  import { $echarts,ECOption } from "@/utils/echarts";
  import {
    onMounted, ref, watch, toRefs
  } from 'vue';
  
  type Props = {
    options: any
  }
  const props = withDefaults(defineProps<Props>(), {
    options: {}
  });
  
  const { options } = toRefs(props);
  const echartsRef = ref<HTMLElement>();
  
  let myChart;
  const initEcharts = (options:ECOption, loading:boolean) => {
    if (!myChart) {
      myChart = $echarts.init(echartsRef.value!);
    }
    if (loading === false) {
      myChart.showLoading({
        text: 'loading',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.2)',
        zlevel: 0
  
      });// 设置加载动画
    } else {
      myChart.hideLoading();
    }
    myChart.setOption(options, { notMerge: true });
  };
  
  onMounted(() => {
    initEcharts(options.value, true);
  });
  
  watch(options, (newOptions) => {
    initEcharts(newOptions, true);
  }, { deep: true });
  
  </script>
  
  <style scoped lang="scss">
  .echarts-wrap {
    width: 100%;
    height: 100%;
  }
  </style>
  