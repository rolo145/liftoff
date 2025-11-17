<script setup lang="ts">
const flakes = Array.from({ length: 38 }, (_, index) => {
  const size = 4 + ((index * 7) % 8);
  return {
    id: index,
    left: `${(index * 13) % 100}%`,
    delay: `${(index % 12) * 0.35}s`,
    duration: `${10 + (index % 6)}s`,
    size: `${size}px`,
  };
});
</script>

<template>
  <div class="snow-layer">
    <span
      v-for="flake in flakes"
      :key="flake.id"
      class="animate-snowfall bg-white/80"
      :style="{
        left: flake.left,
        animationDelay: flake.delay,
        animationDuration: flake.duration,
        width: flake.size,
        height: flake.size,
      }"
    ></span>
  </div>
</template>
