<script setup lang="ts">
// the panel over the bottom of the stage when the run is over. the slot is
// for the stats dl or a button. stack puts the slot under the title instead
// of beside it, for a long note
defineProps<{
  title: string;
  note?: string;
  tone?: "ok" | "bad";
  stack?: boolean;
}>();
</script>

<template>
  <div class="sim-result" :class="[tone, { stack }]" role="status">
    <div class="sim-result-title">
      {{ title }}
      <span v-if="note" class="sim-result-note">{{ note }}</span>
    </div>
    <slot />
  </div>
</template>
