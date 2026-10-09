<script setup lang="ts">
// the event log, newest first. the sim formats the clock itself
export interface SimLogEntry {
  t: number;
  msg: string;
  level?: string;
}

defineProps<{
  entries: SimLogEntry[];
  clock: (t: number) => string;
}>();
</script>

<template>
  <ul class="sim-log">
    <li
      v-for="(entry, i) in entries"
      :key="entries.length - i"
      :class="entry.level"
    >
      <span>{{ clock(entry.t) }}</span
      >{{ entry.msg }}
    </li>
  </ul>
</template>
