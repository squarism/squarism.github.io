<script setup lang="ts">
// the big number at the top of the side column. red unless told otherwise
defineProps<{
  value: string | number;
  label: string;
  tone?: "bad" | "warn" | "ok";
}>();
</script>

<template>
  <div class="sim-card">
    <div class="sim-stat-num" :class="tone">{{ value }}</div>
    <div class="sim-stat-label">{{ label }}</div>
  </div>
</template>
