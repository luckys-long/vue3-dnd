<template>
  <div class="drag-wrap">

    <h1 style="text-align: center; padding: 50px"></h1>
    <div id="relation-box">
      <div
        class="node"
        v-for="item in nodeList"
        :key="item.id"
        :style="{ left: item.left, top: item.top }"
        :id="'node-' + item.id"
      >
        {{ item.name }}
        <div>detail...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { jsPlumb } from "jsplumb";
import * as D3 from "d3";
import { nextTick, onMounted, ref } from "vue";

let jsPlumbInstance = ""; //jsPlumb实例
let jsPlumbSetting = {
  // 动态锚点、位置自适应
  Anchors: [
    "Top",
    "TopCenter",
    "TopRight",
    "TopLeft",
    "Right",
    "RightMiddle",
    "Bottom",
    "BottomCenter",
    "BottomRight",
    "BottomLeft",
    "Left",
    "LeftMiddle",
  ],
  // 连线的样式 StateMachine、Flowchart，Bezier、Straight
  Connector: ["Bezier", { curviness: 60 }],
  // 鼠标是否拖动删除线
  ConnectionsDetachable: false,
  // 删除线的时候节点不删除
  DeleteEndpointsOnDetach: false,
  // 连线的两端端点类型：矩形 Rectangle；圆形Dot； eight: 矩形的高 ，idth: 矩形的宽
  Endpoints: [
    ["Dot", { radius: 2 }],
    ["Dot", { radius: 2 }],
  ],
  // 线端点的样式
  EndpointStyle: { fill: "skyblue", outlineWidth: 1 },
  // 绘制连线
  PaintStyle: {
    stroke: "#000000",
    strokeWidth: 1,
    outlineStroke: "transparent",
    // 设定线外边的宽，单位px
    outlineWidth: 10,
  },
  Overlays: [
    // 箭头叠加
    [
      "Arrow",
      {
        width: 10, // 箭头尾部的宽度
        length: 8, // 从箭头的尾部到头部的距离
        location: 1, // 位置，建议使用0～1之间
        direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
        foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
      },
    ],
  ],
  // 绘制图的模式 svg、canvas
  RenderMode: "svg",
  DragOptions: { cursor: "pointer", zIndex: 2000 },
  // 鼠标滑过线的样式
  HoverPaintStyle: { stroke: "skyblue", strokeWidth: 3, cursor: "pointer" },
};

/*
* Souce 源节点
* Target 目标节点
* Anchor 锚点 锚点位于源节点或者目标节点上
* Endpoint 端点 端点位于连线上
* Connector 连接 或者也可以理解是连接线
* Overlays 绘制箭头
*/ 

let jsPlumbConnectOptions = {
  isSource: true,
  isTarget: true,
  // 动态锚点、提供了4个方向 Continuous、AutoDefault
  anchor: "Continuous",
  overlays: [["Arrow", { width: 8, length: 8, location: 1 }]], // overlay
};
let commonLink = {
  isSource: true,
  isTarget: true,
  anchor: ["Perimeter", { shape: "Circle" }],
  connector: ["Bezier"],
  endpoint: "Dot",
  // 不限制节点的连线数量
  maxConnections: -1,
};

let dataList = {
  id: 1,
  name: "基站",
  children: [
    {
      id: 2,
      name: "CPE",
      children: [
        {
          id: 6,
          name: "交换机",
        },
        {
          id: 7,
          name: "路由器",
        },
      ],
    },
    {
      id: 3,
      name: "基站2",
      children: [
        {
          id: 4,
          name: "路由器1",
        },
        {
          id: 5,
          name: "路由器2",
        },
        {
          id: 8,
          name: "路由器3",
        },
      ],
    },
  ],
};

let nodeList = ref([]);
let lineList = [];

onMounted(() => {
  setNodeInfo(dataList);
  nextTick(() => {
    drawLines();
  });
});

const drawLines = () => {
  jsPlumb.ready(() => {
    // 创建jsPlumb实例
    jsPlumbInstance = jsPlumb.getInstance();
    // 导入准备好的jsPlumb配置
    jsPlumbInstance.importDefaults(jsPlumbSetting);
    // 开始节点间的连线
    lineList.forEach((item) => {
      jsPlumbInstance.connect(item, jsPlumbConnectOptions);
    });
    // 让每个节点都可以被拖拽
    nodeList.value.forEach((item, index) => {
      jsPlumbInstance.draggable("node-" + (index + 1));
      jsPlumbInstance.addEndpoint(
        "node-" + (index + 1),
        {
          anchor: ["Bottom", "Top", "Left", "Right"],
          Overlays: [
            [
              "Arrow",
              {
                width: 10,
                length: 8,
                location: 1,
                direction: 1,
                foldback: 0.623,
              },
            ],
          ],
        },
        commonLink
      );
    });
    // 给每个节点添加锚点
    jsPlumbInstance.repaintEverything(); // 重绘
  });
};

const setNodeInfo = (tree) => {
  // 参考D3API,这里会生成树形数据结构
  const data = D3.hierarchy(tree);
  // 使用D3 Tree自动布局, nodeSize控制节点x方向和y方向上的距离
  const treeGenerator = D3.tree().nodeSize([200, 180]);
  const treeData = treeGenerator(data);
  // 获取自动布局后的节点信息
  const nodes = treeData.descendants();
  // 获取父子关系列表
  const links = treeData.links();
  // 设置节点位置信息
  nodeList.value = nodes.map((item) => {
    return {
      id: item.data.id,
      name: item.data.name,
      left: item.x + 900 + "px", // 900为初始X方向起点位置，默认为0
      top: item.y + "px",
    };
  });

  lineList = links.map((item) => {
    return {
      source: `node-${item.source.data.id}`,
      target: `node-${item.target.data.id}`,
      overlays: [["Arrow", { width: 10, length: 10, location: 0.5 }]],
    };
  });
};

const onStart = () => {};
const onEnd = () => {};
</script>
<style scoped>
#relation-box {
  position: relative;
  
  height: 90vh;
  
}

.node {
  position: absolute;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  text-align: center;
  background-color: #f6f6f6;
  color: black;
}
</style>
