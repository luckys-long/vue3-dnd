<template>
    <div class="pagination-wrap">
      <el-pagination
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        :hide-on-single-page="hide"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[12,24,36,48]"
        :default-page-size="pageSize"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ElPagination } from 'element-plus';
  
  type Props = {
    total: number;
    currentPage?: number;
    pageSize?: number;
    hide?: boolean;
  };
  
  const props = withDefaults(defineProps<Props>(), {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    hide: false,
  });
  
  const emit = defineEmits(['pageChange', 'sizeChange']);
  
  const currentChange = (index: number) => {
    console.log(`current pageNum: ${index}`);
    emit('pageChange', index);
  };
  
  const sizeChange = (size: number) => {
    console.log(`current pageSize: ${size}`);
    emit('sizeChange', size);
  };


  </script>
  
  <style scoped lang="scss">
  .pagination-wrap {
    @include flexCenter;
    text-align: center;
    background-color: #fff;
    font-size: 14px;
    padding: 5px 0;
    .pagination-total {
      margin-right: 19px;
      font-family: MicrosoftYaHei;
      color: #1a1e26;
    }
  
    :deep(.el-pagination__sizes) {
      margin-left: 19px;
      background: #f0f1f3;
      border-radius: 3px;
    }
  }
  
  .el-pagination {
    background-color: #fff;
    justify-content: center;
  }
  </style>
  