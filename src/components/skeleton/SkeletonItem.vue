<template>
    <el-skeleton-item>
        <slot></slot>
    </el-skeleton-item>
</template>

<script setup lang="ts">
import { ElSkeletonItem } from 'element-plus';
import 'element-plus/es/components/skeleton-item/style/css';
</script>
