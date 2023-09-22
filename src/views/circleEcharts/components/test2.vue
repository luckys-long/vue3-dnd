<template>
  <my-ecarts :options="options3"></my-ecarts>
</template>

<script setup>
import { ref } from "vue";
import MyEcarts from "@/components/myEchart.vue";
import { $echarts } from "@/utils/echarts";

const curValue = 66; //当前进度
const maxvalue = 100; //进度条最大值

const options3 = ref({
  backgroundColor: "#29323C",
  title: {
    text: "65%",
    subtext: "总状态",
    x: "center",
    y: "center",
    textStyle: {
      fontWeight: 400,
      fontSize: 22,
      color: "#FFFFFF",
    }, // 标题
    subtextStyle: {
      fontWeight: 400,
      fontSize: 15,
      color: "#999999",
    }, // 副标题
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["45%", "70%"], //饼图的半径，第一个为内半径，第二个为外半径
      hoverAnimation:false,
      labelLine: { show: false },
      data: [
        //value当前进度 + 颜色
        {
          value: curValue,
          itemStyle: {
            color: new $echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "#2B72FA",
              },
              {
                offset: 1,
                color: "#92E077",
              },
            ]),
          },
        },
        {
          value: maxvalue - curValue,
          itemStyle: {
            color:new $echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "#51FFCC",
              },
              {
                offset: 1,
                color: "#51FFCC",
              },
            ]),
          },
        },
      ],
    },
  ],
});
</script>

<style></style>
