<script setup lang="ts">
const flakes = Array.from({ length: 120 }, (_, index) => {
  const size = 3 + Math.floor(Math.random() * 10);
  return {
    id: index,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${9 + Math.random() * 10}s`,
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
