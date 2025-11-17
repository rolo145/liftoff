<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const navLinks = [
  { label: 'Results', to: '/results' },
  { label: 'Teams', to: '/teams' },
  { label: 'Schedule', to: '/schedule' },
];

const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <nav
    class="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 px-4 py-6 backdrop-blur-md sm:flex-row sm:items-center"
  >
    <!-- site logo + tagline -->
    <div class="flex items-center gap-3">
      <div
        class="lights-glow flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/30"
      >
        <span class="text-2xl">🎄</span>
      </div>
      <div>
        <p class="font-display text-3xl text-white drop-shadow">LiftOff</p>
        <p class="text-xs uppercase tracking-[0.2em] text-festive-mint">
          CrossFit Winter Showdown
        </p>
      </div>
    </div>
    <!-- navigation pills -->
    <div class="flex flex-1 flex-wrap items-center justify-end gap-3 text-sm font-semibold">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="rounded-full px-4 py-2 text-white transition hover:bg-white/15"
        :class="isActive(link.to) ? 'bg-white/20 shadow-glow text-festive-gold' : ''"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </nav>
</template>
