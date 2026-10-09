<script setup lang="ts">
// one card in the side column. the title is a mono label, meta sits at the
// right of it, and the note goes under the content in small
defineProps<{ title?: string; meta?: string; note?: string }>();
</script>

<template>
  <div class="sim-card">
    <div v-if="title || meta" class="sim-card-head">
      <span class="sim-label">{{ title }}</span>
      <span v-if="meta" class="sim-card-meta">{{ meta }}</span>
    </div>
    <slot />
    <small v-if="note">{{ note }}</small>
  </div>
</template>
