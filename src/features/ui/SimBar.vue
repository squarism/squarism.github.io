<script setup lang="ts">
// a row of controls above the stage: a mono label, the controls, and a hint
defineProps<{ label?: string; hint?: string }>();
</script>

<template>
  <div class="sim-bar">
    <span v-if="label" class="sim-label">{{ label }}</span>
    <slot />
    <span v-if="hint" class="sim-hint">{{ hint }}</span>
  </div>
</template>
