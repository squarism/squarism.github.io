<script setup lang="ts">
// one card in the side column. the note goes under the content in small
defineProps<{ title?: string; note?: string }>();
</script>

<template>
  <div class="sim-card">
    <h4 v-if="title">{{ title }}</h4>
    <slot />
    <small v-if="note">{{ note }}</small>
  </div>
</template>
