<template>
  <Dialog
    :show="isShow"
    :before-close="handleClosed"
    :title="title"
    width="35%"
    draggable
  >
    <MyTable
      class="table-style"
      ref="multipleTable"
      :column="column"
      :data="filterTableData"
      :header-cell-style="{ 'text-align': 'left' }"
      tooltip-effect="dark"
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
      @select="handleSelect"
    >
      <template #ip>
        <div style="display: flex; align-items: center">
          <p style="width: 30px">IP</p>
          <el-input
            v-model="inputIp"
            class="w-50 m-2"
            placeholder="请输入IP"
            :prefix-icon="Search"
            size="small"
          />
        </div>
      </template>
      <template #name>
        <div style="display: flex; align-items: center">
          <p style="width: 100px">设备名称</p>
          <el-input
            v-model="inputName"
            class="w-50 m-2"
            placeholder="请输入设备名称"
            :prefix-icon="Search"
            size="small"
          />
        </div>
      </template>
      <template #status="scope">
        {{ scope.row.nodeStatus ? "在线" : "离线" }}
      </template>
    </MyTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClosed">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确认 </el-button>
      </span>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/Dialog.vue";
import { ElDialog, ElMessage, ElButton, ElInput } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getBindList, bind } from "@/api/index";
import MyTable from "@/components/Table";
import { computed, onMounted, ref } from "vue";
import { configJsplumb } from "@/store/jsplumb.js";

type Props = {
  isShow: boolean;
  beforeClose(): void;
  doAddHandle?: () => void;
  title?: string;
  rowInfo?: any;
};

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
  doAddHandle: () => {
    /* doAddHandle */
  },
  title: "设备绑定",
});

let configJsplumbData = configJsplumb();

const tableDataList = ref([]);
const curRow = ref([{ nodeIp: "" }]);
const inputIp = ref("");
const inputName = ref("");
const handleClosed = () => {
  props.beforeClose();
};
const multipleTable = ref();

const filterTableData = computed(() =>
  tableDataList.value.filter((data) => RunCase(data))
);

const RunCase = (data) => {
  return inputName.value
    ? !inputName.value ||
        data.nodeName.toLowerCase().includes(inputName.value.toLowerCase())
    : !inputIp.value ||
        data.nodeIp.toLowerCase().includes(inputIp.value.toLowerCase());
};
const handleSelectionChange = (val) => {
  // 单选
  if (val.length > 1) {
    multipleTable.value.clearSelection();
    multipleTable.value.toggleRowSelection(val.pop());
  }
};

const handleSelect = (selection, row) => {
  curRow.value = row;
};

const initBindList = async () => {
  const res = await getBindList();
  tableDataList.value = res;
};

onMounted(() => {
  initBindList();
});

const submitForm = async () => {
  console.log("===curRow", curRow);
  let nodeId = configJsplumbData.bindId;
  await bind({ nodeIp: curRow.value.nodeIp, nodeId });
  props.doAddHandle();
};

const column = [
  { type: "selection" },
  {
    prop: "nodeIp",
    label: "IP地址",
    headerSlot: "ip",
    width: 180,
  },
  {
    prop: "nodeModel",
    label: "型号",
    showOverflowTooltip: true,
    width: 260,
  },
  {
    prop: "nodeName",
    label: "节点名称",
    showOverflowTooltip: true,
    headerSlot: "name",
    width: 250,
  },
  {
    prop: "nodeStatus",
    label: "状态",
    slotName: "status",
  },
  {
    prop: "nodeType",
    label: "类型",
  },
];
</script>

<style lang="scss">
.table-style {
  .el-table-column--selection.is-leaf .el-checkbox {
    display: none;
  }
}
</style>
