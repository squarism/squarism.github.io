<script setup lang="ts">
// the box around every sim: the title with the question beside it, an
// optional intro and goal line, and restart. loads sim.css once for all of
// them. the theme follows the site's.
defineProps<{
  title: string;
  // the question the sim answers, beside the title
  subtitle?: string;
  intro?: string;
  goal?: string;
  done?: boolean;
  // the key that restarts, shown as a keycap on the button
  restartKey?: string;
}>();

defineEmits<{ restart: [] }>();
</script>

<template>
  <div class="sim feature-wide not-prose" :class="{ done }">
    <header class="sim-head">
      <div class="sim-head-text">
        <h3 class="sim-title">{{ title }}</h3>
        <p v-if="subtitle" class="sim-subtitle">{{ subtitle }}</p>
        <p v-if="intro" class="sim-intro">{{ intro }}</p>
        <p v-if="goal" class="sim-intro">
          <span class="sim-label sim-goal-label">Goal</span>&ensp;{{ goal }}
        </p>
      </div>
      <div class="sim-head-actions">
        <button
          type="button"
          :aria-keyshortcuts="restartKey"
          @click="$emit('restart')"
        >
          Restart
          <kbd v-if="restartKey" class="sim-kbd">{{
            restartKey.toUpperCase()
          }}</kbd>
        </button>
      </div>
    </header>
    <slot />
  </div>
</template>

<style src="./sim.css"></style>
