<script setup lang="ts">
import type { ScheduleEntry, Team } from '@/types';

defineProps<{
  team: Team;
  slot?: ScheduleEntry;
}>();
</script>

<template>
  <article class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/20 to-black/60 p-4 sm:p-5 text-white shadow-glow">
    <header class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <p class="text-xs uppercase text-white/60">
          {{ team.category === 'men' ? 'Men + Men' : 'Women + Women' }}
        </p>
        <h3 class="font-semibold text-lg">{{ team.name }}</h3>
      </div>
      <div class="text-right text-xs text-white/70">
        <p>{{ team.athlete1 }}</p>
        <p>{{ team.athlete2 }}</p>
      </div>
    </header>
    <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      <div class="rounded-2xl bg-black/40 p-3 border border-white/5">
        <dt class="text-xs uppercase text-white/60">Snatch</dt>
        <dd class="text-base font-semibold">
          {{ slot?.snatchTime ?? 'TBD' }}
        </dd>
      </div>
      <div class="rounded-2xl bg-black/40 p-3 border border-white/5">
        <dt class="text-xs uppercase text-white/60">Clean &amp; Jerk</dt>
        <dd class="text-base font-semibold">
          {{ slot?.cleanJerkTime ?? 'TBD' }}
        </dd>
      </div>
      <div class="rounded-2xl bg-black/40 p-3 border border-white/5">
        <dt class="text-xs uppercase text-white/60">WOD</dt>
        <dd class="text-base font-semibold">
          {{ slot?.wodTime ?? 'TBD' }}
        </dd>
      </div>
    </dl>
  </article>
</template>
