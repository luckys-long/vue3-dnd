<template>
  <div id="centerRelative">
    <div
      v-for="item in nodeList"
      :id="item.id"
      :key="item.id"
      :style="{
        color: item.color,
        left: item.x + 'px',
        top: item.y + 'px',
      }"
      class="item node-anchor"
      style="display: flex; align-items: center; justify-content: space-around"
      @contextmenu.prevent="handleContextMenu($event, item)"
    >
      <div class="node-anchor anchor-top"></div>
      <div class="node-anchor anchor-bottom"></div>
      <div class="node-anchor anchor-right"></div>
      <div class="node-anchor anchor-left"></div>
      <el-popover
        placement="top-start"
        :title="item.name"
        :width="200"
        trigger="hover"
        content="this is content, this is content, this is content"
      >
        <p>ip: {{ item.nodeIp }}</p>
        <p>状态: {{ item.nodeStatus?'在线':'离线' }}</p>
        <template #reference>
          <svg-icon :iconName="`${ TOPO_TYPE[item.deviceType] || item.icon}`"> </svg-icon>
        </template>
      </el-popover>
      <span> {{ item.deviceType||item.name }}</span>
      <div class="online-point point-flicker" v-if="item.nodeStatus"></div>
      <div class="unline-point" v-else></div>
    </div>
  </div>
  <DeviceDialog
      :isShow="isShow"
      :before-close="()=>isShow=false"
      :doAddHandle="doAddHandle"
      v-if="isShow"
    ></DeviceDialog>

</template>

<script setup>
import {
  reactive,
  toRefs,
  ref,
  onMounted,
  nextTick,
  watch,
  onUnmounted,
} from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { ElPopover, ElMessage } from "element-plus";
import DeviceDialog from "./deviceDialog.vue";
//随机id
import { uuidGenerate } from "@/hooks/utils";
import { configJsplumb } from "@/store/jsplumb.js";
import {
  jsplumbSetting,
  jsplumbConnectOptions,
  jsplumbSourceOptions,
  jsplumbTargetOptions,
} from "@/utils/commonConfig";
//引入jsplumb实例
import jsPlumb from "jsplumb";

import { $contextmenu } from "vue-contextmenu-next/index";

import { getBindList, getTopo, updateTopo } from "@/api/index";

import {TOPO_TYPE} from '@/constants/category'
import { onKeyStroke } from "@vueuse/core";
let configJsplumbData = configJsplumb();

const props = defineProps({
  isEdit: false,
});

let $jsPlumb = jsPlumb.jsPlumb;

// 缓存实例化的jsplumb对象
let jsPlumb_instance = null;

let data = reactive({
  jsplumbSettingConfig: jsplumbSetting,
  jsplumbConnectOptionsConfig: jsplumbConnectOptions,
  jsplumbSourceOptionsConfig: jsplumbSourceOptions,
  jsplumbTargetOptionsConfig: jsplumbTargetOptions,
});

//节点数据
const nodeList = ref([]);
const lineList = ref([]);
// 显示设备绑定弹窗
const isShow = ref(false);

let {
  jsplumbTargetOptionsConfig,
  jsplumbSourceOptionsConfig,
  jsplumbConnectOptionsConfig,
  jsplumbSettingConfig,
} = toRefs(data);

// vueUSE  监听 键盘事件
onKeyStroke(["z", "Z"], (e) => {
  e.preventDefault();
  if (e.ctrlKey) {
    const lastItem = nodeList.value.at(-1);
    nodeList.value.pop();
    jsPlumb_instance.remove(lastItem.id);
  }
});

onKeyStroke(["s", "S"],  (e) => {
  e.preventDefault();
  if (e.ctrlKey) {
   saveOptions()
  }
});




// 强调执行顺序 很重要 vue3 不好的地方
const initDrawData = async () => {
  const res = await getTopo();
  nodeList.value = res.deviceList;
  lineList.value = res.ligatureList.map((item) => {
    return { id: item.lineId, from: item.lineStart, to: item.lineEnd };
  });
};


onMounted(() => {
  jsPlumb_instance = $jsPlumb.getInstance();
  // 画布中的初始值
  //因为jsplimb要在dom元素加载之后才能执行，因为他的原理是找到你绑定的画布dom去渲染svg数据，所以必须得画布dom已经渲染之后才能初始化
  nextTick(() => {
    // initDrawData().then(()=>{
      init();
    // });
  });
});



//初始化
const init = () => {
  //ready监听jsplumb是否实例化，当jsplumb实例化执行ready内的方法，
  jsPlumb_instance.ready(() => {
    //给jsplumb设置一些默认值
    jsPlumb_instance.importDefaults(jsplumbSettingConfig.value);
    loadEasyFlow();
    // 会使整个jsPlumb立即重绘。 这里第二个参数的true，会使整个jsPlumb立即重绘。
    jsPlumb_instance.setSuspendDrawing(false, true);
    // 点击链接线 可以进行删除
    jsPlumb_instance.bind("dblclick", function (conn, originalEvent) {
      jsPlumb_instance.deleteConnection(conn);
      lineList.value.forEach((item, index) => {
        if (item.from === conn.sourceId && item.to === conn.targetId) {
          lineList.value.splice(index, 1);
        }
      });
    });
    //连线
    jsPlumb_instance.bind("connection", (evt) => {
      let from = evt.source.id;
      let to = evt.target.id;
      lineList.value.push({
        from: from,
        to: to,
        label: "", //连线名称
        id: uuidGenerate(),
        Remark: "",
      });
    });
  });
};

/*
 * 加载连接线-初始化节点，使节点可以拖拽
 */
const loadEasyFlow = () => {
  // 初始化节点
  for (let i = 0; i < nodeList.value.length; i++) {
    let node = nodeList.value[i];
    // 设置源点，可以拖出线连接其他节点
    jsPlumb_instance.makeSource(node.id, jsplumbSourceOptionsConfig.value);
    // // 设置目标点，其他源点拖出的线可以连接该节点
    jsPlumb_instance.makeTarget(node.id, jsplumbTargetOptionsConfig.value);
    // this.jsPlumb.draggable(node.id);
    //画布节点添加拖拽方法
    draggableNode(node.id);
  }
  console.log("==>init", nodeList.value, lineList.value);
  //  jsPlumb_instance.unbind("connection"); //取消连接事件
  for (let i = 0; i < lineList.value.length; i++) {
    let line = lineList.value[i];
    jsPlumb_instance.connect(
      {
        source: line.from,
        target: line.to,
      },
      jsplumbConnectOptionsConfig.value
    );
  }
};

// jsPlumbInstance.draggable("node-" + (inde

const draggableNode = (nodeId) => {
  console.log(nodeId, "nodeId======>", nodeList.value);
  //给画布节点添加拖拽方法
  jsPlumb_instance.draggable(nodeId, {
    grid: [5, 5],
    containment: "center",
    drag: (event) => {
      window.event
        ? (window.event.cancelBubble = true)
        : event.stopPropagation();
      return false;
    },
    stop: (event) => {
      changePosition(nodeId, event.pos);
    },
  });
};

const changePosition = (nodeId, pos) => {
  let nodeIndex = nodeList.value.findIndex((x) => x.id === nodeId);
  nodeList.value[nodeIndex] = {
    ...nodeList.value[nodeIndex],
    x: pos[0],
    y: pos[1],
  };
};

const deleteBtn = (item) => {
  let nodeIndex = nodeList.value.findIndex((x) => x.id === item.id);
  nodeList.value.splice(nodeIndex, 1);
  jsPlumb_instance.remove(item.id);
  rightClick();
  return true;
};

/*
 * 获取该节点下的其他节点
 */
const autoTopoBtn = async (item) => {
  
};


const bindDeviceBtn=async(item)=>{
  saveOptions()
  isShow.value=true
  rightClick();
  configJsplumbData.updateBindId(item.id);
}

const doAddHandle = () => {
  // todo  请求列表
  isShow.value = false;

  initDrawData()
  ElMessage({
    message: "绑定成功",
    type: "success",
  });
};

//复制节点
const copyNodeBtn = (item) => {
  let list = JSON.parse(JSON.stringify(item));
  list.id = uuidGenerate();
  list.x = item.x + 300;
  nodeList.value.push(list);
  nextTick(() => {
    jsPlumb_instance.makeSource(list.id, jsplumbSourceOptionsConfig.value);
    jsPlumb_instance.makeTarget(list.id, jsplumbConnectOptionsConfig.value);
    draggableNode(list.id);
  });
  rightClick();
};

const rightClick = () => {
  document.querySelectorAll(".customLayoutClass")[0].style.display = "none";
};

const saveOptions= async()=>{
  console.log("===>lineList", nodeList.value, lineList.value);
    const deviceList = nodeList.value.map((item) => {
      // nodeStatus 0 离线  nodeType：name 
      return { ...item, nodeStatus: 1, nodeType:'',deviceType:item.deviceType  };
    });
    const ligatureList = lineList.value.map((item) => {
      return { lineStart: item.from, lineEnd: item.to, lineId: item.id };
    });
    const params = {
      deviceList: deviceList,
      ligatureList: ligatureList,
    };
    configJsplumbData.updateDraged(nodeList.value);
    // await updateTopo({ ...params });
    ElMessage({
      showClose: true,
      message: "绘图操作已成功保存",
      type: "success",
    });
}
const handleContextMenu = ($event, item, index) => {
  console.log("e=>", $event, item);
  $contextmenu({
    x: $event.x,
    y: $event.y,
    customLayoutClass: "customLayoutClass",
    menuList: [
      {
        text: "删除",
        icon: "DeleteFilled",
        onClick: () => {
          deleteBtn(item);
        },
      },
      {
        text: "复制",
        icon: "DocumentCopy",
        onClick: () => {
          copyNodeBtn(item);
        },
      },
      {
        text: "设备绑定",
        icon: "Location",
        onClick: () => {
          bindDeviceBtn(item);
        },
      },
      {
        text: "自动拓扑",
        icon: "Link",
        onClick: () => {
          autoTopoBtn(item);
        },
      },
    ],
  });
};

watch(
  configJsplumbData.jslumbSortData,
  () => {
    if (configJsplumbData.jslumbSortData.length > 0) {
      const dragedNode = configJsplumbData.jslumbSortData[0];
      console.log("===>",dragedNode);
      nodeList.value.push(dragedNode);
      //从左侧拖拽添加节点,添加新的节点后，要重绘画布
      nextTick(() => {
        // 配置元素并随后从该元素中拖动连接时，将创建并分配一个新的端点
        jsPlumb_instance.makeSource(dragedNode.id, jsplumbSourceOptionsConfig.value);
        jsPlumb_instance.makeTarget(dragedNode.id, jsplumbConnectOptionsConfig.value);
        draggableNode(dragedNode.id);
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => props.isEdit,
  (val) => {
    console.log("===>", val);
    let elem = document.querySelectorAll(".item");
    // if (props.isEdit) {
    //   //区域范围内的节点可拖拽
    //   jsPlumb_instance.draggable(elem, false);
    // } else {
    //   //节点是否可拖拽
    //   jsPlumb_instance.setDraggable(elem, true);
    // }
  }
);

onUnmounted(() => {
  jsPlumb_instance.reset();
  jsPlumb_instance = null;
});
</script>

<style lang="scss" scoped>
@keyframes scale {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
.online-point {
  width: 15px;
  height: 15px;
  background-color: #2ea598;
  position: relative;
  border-radius: 50%;
}

.unline-point {
  width: 15px;
  height: 15px;
  background-color: #909399;
  position: relative;
  border-radius: 50%;
}

/* 设置动画前颜色 */
.point-flicker:after {
  background-color: #2ea598;
}

/* 设置动画后颜色 */
.point-flicker:before {
  background-color: rgba(0, 168, 253, 0.2);
}
// #909399
/* 设置动画 */
.point-flicker:before,
.point-flicker:after {
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -10px;
  margin-top: -10px;
  border-radius: 50%;
  /* CSS3 animation 属性 网址 */
  animation: scale 1.5s ease-out 0s infinite;
}

#centerRelative {
  position: relative;
  width: calc(100vw - 200px);
  height: calc(100vh - 100px);
  // background-image: url("@/assets/bg.png");
  .item {
    position: absolute;
    text-align: center;
    padding: 5px 10px;
    border: 1px dashed #eaeaea;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 168px;
    height: 65px;
    font-size: 14px;
    cursor: pointer;
    background: white;
    svg {
      width: 50px;
      height: 50px;
    }
  }
}
</style>

<style lang="scss">
.customLayoutClass {
  width: 152px !important;
  .context-menu-item {
    font-size: 13px;
    height: 29px;
    padding: 0;
    .arrow {
      .icon {
        width: 0.7rem;
      }
    }
  }
}

.node-anchor {
  width: 10px;
  height: 10px;
  border: 1px solid red;
  z-index: 333;
}
.anchor-top {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 48%;
  margin-top: -6px;
}
.anchor-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  margin-left: 48%;
  margin-bottom: -6px;
}
.anchor-right {
  position: absolute;
  right: 0;
  margin-right: -7px;
}
.anchor-left {
  position: absolute;
  left: 0;
  margin-left: -7px;
}
</style>
