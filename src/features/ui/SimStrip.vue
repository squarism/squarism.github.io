<script setup lang="ts">
// the last 60 seconds, one cell each, oldest on the left. a cell's class is
// ok, warn, bad, down or empty
defineProps<{ cells: string[] }>();
</script>

<template>
  <div class="sim-strip">
    <i v-for="(cls, i) in cells" :key="i" :class="cls"></i>
  </div>
</template>
