<template>
  <el-form ref="formRef" :model="formModels" :rules="formRules"  v-bind="$attrs">
    <el-row>
      <template v-for="(column, index) in formColumns" :key="index">
        <template v-if="column.slotName">
          <slot :name="column.slotName"></slot>
        </template>
        <el-col v-else :span="column.span" :offset="column.offset">
          <el-form-item
            :label="column.label"
            :prop="column.prop"
            v-bind="column.formItemOpts"
          >
            <component
              :is="componentsTypes[column.tag]"
              v-bind="column"
              v-model="formModels[column.prop]"
            ></component>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="4" :offset="1" v-if="!slots.footer">
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="submitForm(formRef)">
            查询
          </el-button>
          <el-button :icon="RefreshLeft" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="slots.footer">
      <slot name="footer" v-bind="formRef"> </slot>
    </template>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { computed, markRaw, ref, useSlots } from "vue";
import { ElForm, ElFormItem, ElCol, ElButton, ElRow } from "element-plus";
import { Search, RefreshLeft } from "@element-plus/icons-vue";

import {
  Autocomplete,
  Cascader,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
} from "./components";

const emit = defineEmits(["onSubmit", "resetForm"]);
const slots = useSlots();
const props = defineProps({
  // 表单数据
  formData: {
    type: Object,
    default: () => {
      //
    },
  },
  // 表单配置项
  formColumns: {
    type: Array as any,
    default: () => [],
  },
  // 表单规则验证
  formRules: {
    type: Object,
    default: () => {
      //
    },
  },
});

// 定义动态组件
const componentsTypes: any = markRaw({
  Input,
  Select,
  Cascader,
  DatePicker,
  Radio,
  Switch,
  Autocomplete,
  Checkbox,
  InputNumber,
});

const formModels = computed(() => props.formData);

// 将表单绑定的ref暴露给父组件
const formRef = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      emit("onSubmit", props.formData);
    } else {
      console.log("error submit!");
      return false;
    }
    return null;
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
