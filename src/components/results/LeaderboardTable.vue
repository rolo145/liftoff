<script setup lang="ts">
import type { LeaderboardEntry } from "@/types";
import { formatSecondsToTime } from "@/utils/scoring";

defineProps<{
  entries: LeaderboardEntry[],
}>();

const getInitials = (name: string | undefined) => {
  if (!name) { return ""; }
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) { return ""; }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
};

const formatLiftBreakdown = (entry: LeaderboardEntry, type: "snatch" | "clean") => {
  // return a total + pair breakdown for the requested lift
  const [athlete1, athlete2] = entry.athletes;
  if (type === "snatch") {
    return {
      total: entry.snatchTotal,
      pairs: [
        { label: getInitials(athlete1), value: entry.snatchAthlete1 },
        { label: getInitials(athlete2), value: entry.snatchAthlete2 },
      ],
    };
  }
  return {
    total: entry.cleanTotal,
    pairs: [
      { label: getInitials(athlete1), value: entry.cleanAthlete1 },
      { label: getInitials(athlete2), value: entry.cleanAthlete2 },
    ],
  };
};
</script>

<template>
  <div
    class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/40 to-black/80 shadow-glow backdrop-blur"
  >
    <div class="hidden overflow-hidden lg:block">
      <table class="min-w-full divide-y divide-white/10 text-left text-sm text-white">
        <thead class="bg-white/5 text-xs uppercase tracking-wide text-white/80">
          <tr>
            <th
              scope="col"
              class="px-4 py-3">
              Rank
            </th>
            <th
              scope="col"
              class="px-4 py-3">
              Team
            </th>
            <th
              scope="col"
              class="px-4 py-3">
              Category
            </th>
            <th
              scope="col"
              class="px-4 py-3">
              Snatch (kg)
            </th>
            <th
              scope="col"
              class="px-4 py-3">
              Clean &amp; Jerk (kg)
            </th>
            <th
              scope="col"
              class="px-4 py-3">
              WOD Time
            </th>
            <th
              scope="col"
              class="px-4 py-3">
              Points
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr
            v-for="entry in entries"
            :key="entry.teamId"
            class="transition hover:bg-white/5"
            :class="entry.rank === 1 ? 'bg-gradient-to-r from-white/10' : ''"
          >
            <td class="px-4 py-4 text-center text-xl font-black text-festive-gold">
              {{ entry.rank }}
            </td>
            <td class="px-4 py-4">
              <div class="space-y-1">
                <p class="font-semibold">
                  {{ entry.athletes[0] }}
                </p>
                <p class="font-semibold">
                  {{ entry.athletes[1] }}
                </p>
              </div>
            </td>
            <td class="px-4 py-4 capitalize text-white/70">
              {{ entry.categoryLabel }}
            </td>
            <td class="px-4 py-4 text-sm leading-snug">
              <div class="font-semibold text-base text-festive-mint">
                {{ formatLiftBreakdown(entry, 'snatch').total }} kg
              </div>
              <div class="flex flex-wrap gap-2 text-[13px]">
                <span
                  v-for="pair in formatLiftBreakdown(entry, 'snatch').pairs"
                  :key="pair.label"
                  class="rounded-full bg-white/10 px-3 py-1 text-white"
                >
                  {{ pair.label }} — {{ pair.value }}kg
                </span>
              </div>
            </td>
            <td class="px-4 py-4 text-sm leading-snug">
              <div class="font-semibold text-base text-festive-mint">
                {{ formatLiftBreakdown(entry, 'clean').total }} kg
              </div>
              <div class="flex flex-wrap gap-2 text-[13px]">
                <span
                  v-for="pair in formatLiftBreakdown(entry, 'clean').pairs"
                  :key="pair.label"
                  class="rounded-full bg-white/10 px-3 py-1 text-white"
                >
                  {{ pair.label }} — {{ pair.value }}kg
                </span>
              </div>
            </td>
            <td class="px-4 py-4 font-semibold">
              {{ formatSecondsToTime(entry.wodSeconds) ?? '—' }}
            </td>
            <td class="px-4 py-4 font-bold">
              {{ entry.totalPoints }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="lg:hidden">
      <article
        v-for="entry in entries"
        :key="entry.teamId"
        class="border-b border-white/10 p-4 last:border-none"
      >
        <div class="flex items-center justify-between">
          <span class="text-lg font-black text-festive-gold">#{{ entry.rank }}</span>
          <span class="rounded-full bg-white/10 px-2 py-0.5 text-xs uppercase">
            {{ entry.categoryLabel }}
          </span>
        </div>
        <div class="mt-1 space-y-1 text-sm text-white/80">
          <p>{{ entry.athletes[0] }}</p>
          <p>{{ entry.athletes[1] }}</p>
        </div>
        <div class="mt-3 space-y-2 text-sm">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-white/50">
              Snatch total
            </p>
            <p class="font-semibold text-festive-mint">
              {{ formatLiftBreakdown(entry, 'snatch').total }} kg
            </p>
            <div class="flex flex-wrap gap-2 text-[12px]">
              <span
                v-for="pair in formatLiftBreakdown(entry, 'snatch').pairs"
                :key="pair.label"
                class="rounded-full bg-white/10 px-2 py-0.5"
              >{{ pair.label }} {{ pair.value }}kg</span
              >
            </div>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-white/50">
              Clean &amp; jerk
            </p>
            <p class="font-semibold text-festive-mint">
              {{ formatLiftBreakdown(entry, 'clean').total }} kg
            </p>
            <div class="flex flex-wrap gap-2 text-[12px]">
              <span
                v-for="pair in formatLiftBreakdown(entry, 'clean').pairs"
                :key="pair.label"
                class="rounded-full bg-white/10 px-2 py-0.5"
              >{{ pair.label }} {{ pair.value }}kg</span
              >
            </div>
          </div>
          <div class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
            <span>WOD</span>
            <span class="text-sm font-semibold text-white">
              {{ formatSecondsToTime(entry.wodSeconds) ?? '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs uppercase tracking-[0.3em] text-white/60">Points</span>
            <span class="text-lg font-bold text-white">{{ entry.totalPoints }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
