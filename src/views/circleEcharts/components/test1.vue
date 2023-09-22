<template>
  <my-ecarts :options="options3"></my-ecarts>
</template>

<script setup>
import { ref } from "vue";
import MyEcarts from "@/components/myEchart.vue";

const data = [
  { value: 1048, name: "5G基站" },
  { value: 735, name: "融合基站" },
  { value: 580, name: "WI-FI 6基站" },
];

// 计算每部分比例，以及开始角度，结束角度
const dataTotal = data.reduce((prev, curr) => prev + curr.value, 0);

data.forEach((item, idx) => {
  item.percent = item.value / dataTotal;
  item.angle = item.percent * Math.PI * 2; // 弧度制的角度
  if (idx == 0) {
    item.startAngle = 0;
    item.endAngle = item.angle;
  } else {
    item.startAngle = data[idx - 1].startAngle + data[idx - 1].angle;
    item.endAngle = item.startAngle + item.angle;
  }
});

/**
 * 线性渐变起止方向的计算方法
 * @param {*} startArc 开始角度
 * @param {*} endArc 结束角度
 * @returns 四个坐标 x,y,x2,y2
 */
function getCoordinates(startArc, endArc) {
  // 这里计算扇形最外层的x,y坐标
  const position = [
    Math.sin(startArc),
    -Math.cos(startArc),
    Math.sin(endArc),
    -Math.cos(endArc),
  ];
  // 这里求得了最外层两个顶点坐标的差值。
  const dx = position[2] - position[0];
  const dy = position[3] - position[1];

  // 这里在根据两点坐标的差值计算x,y,x2,y2
  return getLocation(dx, dy);
}

function getLocation(dx, dy) {
  const tanV = dx / dy;
  // 这里是在计算按照横向渐变还是按照纵向渐变。
  const directSign = Math.abs(tanV) < 1;
  const t = directSign ? tanV : 1 / tanV;

  const sign1 = t > 0 ? 1 : -1;
  const sign2 = dx > 0 ? 1 : -1;
  const sign = directSign ? sign1 * sign2 : sign2;

  // 把整个圆形的坐标映射到了[0-1]之间0.5，0.5即为圆心坐标。
  const group1 = [0.5 - (sign * t) / 2, 0.5 + (sign * t) / 2];
  // 这里给纵向渐变还是横向渐变赋值、即group中的第三项和第四项的值
  const group2 = sign > 0 ? [0, 1] : [1, 0];
  const group = [...group1, ...group2];
  const keys = directSign ? ["x", "x2", "y", "y2"] : ["y", "y2", "x", "x2"];

  const res = {};
  keys.forEach((k, idx) => {
    res[k] = group[idx];
  });
  return res;
}

/**
 * 给数据写入 样式(线性渐变)
 *
 * @param {*} data 数据
 * @param {*} colorlist 颜色列表
 * @param {*} startOpacity 开始颜色的透明度
 * @param {*} endOpacity 结束颜色透的明度
 * @returns 带样式的数据
 */
function setGradientColorInItemStyle(
  data,
  colorlist,
  startOpacity = 1,
  endOpacity = 0
) {
  for (let i = 0; i < data.length; i++) {
    const color = colorlist[i];
    const startAngle = data[i].startAngle;
    const endAngle = data[i].endAngle;
    // 这里计算了 线性渐变的起止方向
    // @ts-ignore
    const coordinates = getCoordinates(startAngle, endAngle);
    data[i].itemStyle = {
      color: {
        ...coordinates,
        type: "linear",
        global: false,
        colorStops: [
          {
            offset: 0,
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${startOpacity})`,
          },
          {
            offset: 1,
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${endOpacity})`,
          },
        ],
      },
    };
  }
  return data;
}

// 颜色列表
const color = [
  {
    r: 81,
    g: 255,
    b: 204,
  },
  {
    r: 67,
    g: 135,
    b: 245,
  },
  {
    r: 247,
    g: 204,
    b: 106,
  },
];

const options3 = ref({
  backgroundColor: "#29323C",
  title: {
    text: "处理事务",
    subtext: "1800个",
    x: "center",
    y: "center",
    textStyle: {
      fontWeight: "normal",
      fontSize: 16,
      color: "#F0F0F0",
    }, // 标题
    subtextStyle: {
      fontWeight: "normal",
      fontSize: 15,
      color: "#F0F0F0",
    }, // 副标题
  },
  tooltip: {
    trigger: "item", // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["45%", "70%"], //饼图的半径，第一个为内半径，第二个为外半径
      center: ["50%", "51%"],
      label: {
        formatter: "{b}\n  {c}个",
      },
      hoverAnimation: false,
      radius: ["45%", "70%"], //饼图的半径，第一个为内半径，第二个为外半径
      center: ["50%", "51%"],
      data: setGradientColorInItemStyle(data, color),
    },
  ],
});
</script>

<style></style>
