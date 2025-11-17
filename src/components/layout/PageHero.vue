<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  badge?: string;
}>();
</script>

<template>
  <section
    class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-festive-red/80 via-festive-dark/80 to-festive-red/60 px-6 py-8 text-white shadow-2xl"
  >
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]"></div>
    <div class="relative z-10 flex flex-col gap-1">
      <p v-if="badge" class="text-xs uppercase tracking-[0.3em] text-white/70">{{ badge }}</p>
      <h1 class="font-display text-3xl sm:text-4xl">{{ title }}</h1>
      <p class="text-sm sm:text-base text-white/80">
        {{ subtitle }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <slot />
      </div>
    </div>
  </section>
</template>
