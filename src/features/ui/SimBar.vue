<script setup lang="ts">
// a row of controls above the stage: a label, the buttons, and a hint
defineProps<{ label?: string; hint?: string }>();
</script>

<template>
  <div class="sim-bar">
    <span v-if="label" class="sim-bar-label">{{ label }}</span>
    <slot />
    <span v-if="hint" class="sim-hint">{{ hint }}</span>
  </div>
</template>
