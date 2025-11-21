<script setup lang="ts">
import type { Team } from "@/types";

defineProps<{
  team: Team,
}>();
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-white/0 p-5 text-white shadow-lg shadow-black/40"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs uppercase tracking-[0.2em] text-white/60">
        {{ team.category === 'men' ? 'Men + Men' : 'Women + Women' }}
      </p>
    </div>
    <ul class="space-y-1 text-sm text-white/80">
      <li>👟 {{ team.athlete1 }}</li>
      <li>🏋️ {{ team.athlete2 }}</li>
    </ul>
  </article>
</template>
