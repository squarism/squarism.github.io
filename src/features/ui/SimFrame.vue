<script setup lang="ts">
// the box around every sim: title, intro, goal and the restart button, then
// whatever the sim puts inside. loads sim.css once for all of them.
defineProps<{
  title: string;
  intro?: string;
  goal: string;
  done?: boolean;
  // shown to screen readers as the shortcut for restart, when a sim has one
  restartKey?: string;
}>();

defineEmits<{ restart: [] }>();
</script>

<template>
  <div class="sim feature-wide not-prose" :class="{ done }">
    <header class="sim-head">
      <div>
        <h3 class="sim-title">{{ title }}</h3>
        <p v-if="intro" class="sim-intro">{{ intro }}</p>
        <p class="sim-goal">
          <span class="sim-goal-label">Goal</span> {{ goal }}
        </p>
      </div>
      <button
        type="button"
        :aria-keyshortcuts="restartKey"
        @click="$emit('restart')"
      >
        Restart
      </button>
    </header>
    <slot />
  </div>
</template>

<style src="./sim.css"></style>
