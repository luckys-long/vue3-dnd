<template>
  <div>
    <div style="padding: 10px 13px" class="circle-wrap">
      <div class="left-wrap">
        <div class="ehart-wrap-1">
          <my-ecarts :options="options"></my-ecarts>
        </div>
        <div class="ehart-wrap-2">
          <Test3></Test3>
        </div>
      </div>

      <div class="right-wrap">
        <div class="ehart-wrap-1"></div>
        <div style="margin-top: 10px; width: 355px; height: 200px"></div>
        <div class="ehart-wrap-2">
          <Test2 />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MyEcarts from "@/components/myEchart.vue";
import { $echarts } from "@/utils/echarts";

import Test3 from "@/views/circleEcharts/components/test1.vue";
import Test2 from "@/views/circleEcharts/components/test2.vue";

const errorTypesColor = {
  personnel: {
    startColor: "rgba(255,186,0,0.8)",
    endColor: "rgba(255,193,0, 1)",
    topStartColor: "rgba(255,176,49,1)",
    topEndColor: "rgba(255,199,0,1)",
  },
  baseStation: {
    startColor: "rgba(255,186,0,0.8)",
    endColor: "rgba(255,193,0, 1)",
    topStartColor: "rgba(255,176,49,1)",
    topEndColor: "rgba(255,199,0,1)",
  },
  terminal: {
    startColor: "rgba(255,186,0,0.8)",
    endColor: "rgba(255,193,0, 1)",
    topStartColor: "rgba(255,176,49,1)",
    topEndColor: "rgba(255,199,0,1)",
  },
};

const data = [
  {
    value: 469,
    label: "人员总数",
    startColor: errorTypesColor.startColor,
    endColor: errorTypesColor.endColor,
    topStartColor: errorTypesColor.endColor,
    topEndColor: errorTypesColor.topEndColor,
  },
  {
    value: 754,
    label: "基站总数",
    startColor: errorTypesColor.startColor,
    endColor: errorTypesColor.endColor,
    topStartColor: errorTypesColor.endColor,
    topEndColor: errorTypesColor.topEndColor,
  },
  {
    value: 150,
    label: "终端总数",
    startColor: errorTypesColor.startColor,
    endColor: errorTypesColor.endColor,
    topStartColor: errorTypesColor.endColor,
    topEndColor: errorTypesColor.topEndColor,
  },
];
// 根据后端数据进行选择  color: getEnumColorById(tag, selected)
const options = ref({
  backgroundColor: "#29323C",

  xAxis: {
    type: "category",
    data: data.map((i) => i.label),
    // x坐标轴为虚线
    axisLine: {
      lineStyle: {
        color: "rgba(11, 73, 125, 0.33)",
        opacity: 0.8,
      },
    },
    // 不展示下面｜
    axisTick: {
      show: true,
    },
    axisLabel: {
      show: true,
      color: "#B0E1FF",
      fontSize: 12, // 字体大小
    },
  },
  yAxis: {
    type: "value",
    // 不展示刻度线
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      color: "#B0E1FF",
      fontSize: 12, // 字体大小
    },
  },
  // 栅格
  grid: {
    left: "0",
    right: "0",
    bottom: "0%",
    top: "22px",
    containLabel: true,
  },
  series: [
    // 数据低下的圆片
    {
      name: "",
      type: "pictorialBar",
      symbol: "diamond",
      symbolSize: [16, 9], // 宽，高
      symbolOffset: [0, 5], // 左 上
      symbolPosition: "start",
      z: 1,
      data: data,
      itemStyle: {
        color: new $echarts.graphic.LinearGradient(1, 0, 0, 0, [
          {
            offset: 1,
            color: "#6DCDE6",
          },
          {
            offset: 1,
            color: "#6DCDE6",
          },
        ]),
      },
    },
    // 数据的柱状图
    {
      name: "",
      type: "bar",
      barWidth: 8, // 柱条的宽度，不设时自适应。
      data: data,
      itemStyle: {
        color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#6DCDE6",
          },
          {
            offset: 1,
            color: "#38A0D6",
          },
        ]),
        // emphasis: {
        //   borderWidth: 15,
        //   borderColor: 'red',
        // }
      },
    },
    {
      name: "",
      type: "bar",
      barWidth: 8, // 柱条的宽度，不设时自适应。
      barGap: 0, // 不同系列的柱间距离
      data: data,
      itemStyle: {
        color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#6DCDE6",
          },
          {
            offset: 1,
            color: "#38A0D6",
          },
        ]),
        borderWidth: 0.1,
        borderColor: "transparent",
      },
    },
    // 数据顶部的样式
    {
      name: "",
      type: "pictorialBar",
      symbol: "diamond",
      symbolSize: [16, 9],
      symbolOffset: [0, -4],
      symbolPosition: "end",
      z: 3,
      itemStyle: {
        color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#38A0D6",
          },
          {
            offset: 1,
            color: "#6DCDE6",
          },
        ]),
        label: {
          show: true, // 开启显示
          position: "top", // 在上方显示
          fontSize: "12",
          color: "#B0E1FF",
        },
      },
      data: data,
    },
  ],
});
</script>
<style lang="scss">
.left-wrap {
  .ehart-wrap-1 {
    width: 355px;
    height: 220px;
  }
  .ehart-wrap-2 {
    width: 355px;
    height: 208px;
  }
}
.right-wrap {
  .ehart-wrap-1 {
    width: 355px;
    height: 220px;
  }
  .ehart-wrap-2 {
    width: 355px;
    height: 208px;
  }
}

.circle-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
