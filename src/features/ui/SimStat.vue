<script setup lang="ts">
// the big number at the top of the side column, with room under it for a
// dl of the smaller numbers. plain unless given a tone
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
    <div v-if="$slots.default" class="sim-stat-body">
      <slot />
    </div>
  </div>
</template>
