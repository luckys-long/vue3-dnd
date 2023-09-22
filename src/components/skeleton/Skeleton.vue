<template>
    <el-skeleton animated>
    <template #template>
        <slot name='template'></slot>
    </template>
    <template #default>
        <slot name='default'></slot>
    </template>
    </el-skeleton>
</template>

<script setup lang="ts">
import { ElSkeleton } from 'element-plus';
import 'element-plus/es/components/skeleton/style/css';
</script>
