<template>
  <ul id="leftUl">
    <li v-for="(item, index) in dragData" :key="index">
      <svg-icon :iconName="`${item.icon}`"> </svg-icon>
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { onMounted } from "vue";
import Sortable from "sortablejs";
import { configJsplumb } from "@/store/jsplumb.js";
import { uuidGenerate } from "@/hooks/utils";
import SvgIcon from "@/components/SvgIcon.vue";

let dragData = [
  {
    deviceType: "基站",
    name: "基站",
    icon: "icon-tuoputu_jizhan",
  },
  {
    deviceType: "交换机",
    name: "交换机",
    icon: "icon-tuoputu_jiaohuanjizu",
  },
  {
    deviceType: "路由器",
    name: "路由器",
    icon: "icon-tuoputu_luyouqi",
  },
  {
    deviceType: "摄像头",
    name: "摄像头",
    icon: "icon-tuoputu_fuwuqi",
  },
];

let configJsplumbData = configJsplumb();

onMounted(() => {
  // 第一步，获取行容器
  let dome = document.getElementById("leftUl");
  // 第二步，初始化，给容器指定对应拖拽规则
  new Sortable(dome, {
    group: "shared",
    animation: 150,
    sort: false, //关闭在盒内可以拖拽
    forceFallback: true, //忽略 HTML5拖拽行为，强制回调进行
    ghostClass: "blue-background-class", //drop placeholder的css类名
    //结束拖拽
    onEnd: function (evt) {
      //当元素移动的距离左侧小于309px的时候并且距离顶部的距离小于69px的时候，禁止插入
      if (evt.originalEvent.x < 309 && evt.originalEvent.y < 69) return;
      let list = {
        id: uuidGenerate(), //生成随机Id
        x: evt.originalEvent.x - 310, //落下的位置(310是左侧列表整体的宽度)
        y: evt.originalEvent.y - 70, //落下的位置(70是头部的宽度)
      };
      //根据当前数据的下标拿到对应数据的，并和list合并
      Object.assign(list, dragData[evt.newIndex]);
      console.log("===>",list);
      //并使用pinia来存储数据
      configJsplumbData.updateSortData(list);
    },
  });
});
</script>

<style lang="scss" scoped>
#leftUl {
  height: 100%;
  box-sizing: border-box;
  padding: 0 5px;
  list-style: none;
  width: 188px;

  li {
    text-align: center;
    padding: 10px 10px;
    border: 1px solid #eaeaea;
    margin-bottom: 3px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    background: white;
    &:first-child {
      margin-top: 3px;
    }
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    svg {
      width: 85px;
      height: 85px;
    }
  }
}
</style>
