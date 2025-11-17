<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PageHero from '@/components/layout/PageHero.vue';
import SectionCard from '@/components/ui/SectionCard.vue';
import StateMessage from '@/components/ui/StateMessage.vue';
import LeaderboardTable from '@/components/results/LeaderboardTable.vue';
import { useTeamsStore } from '@/stores/teams';
import { useResultsStore } from '@/stores/results';
import { useWorkoutStore } from '@/stores/workout';
import { computeLeaderboardByCategory } from '@/utils/scoring';
import type { Category } from '@/types';

const teamsStore = useTeamsStore();
const resultsStore = useResultsStore();
const workoutStore = useWorkoutStore();

onMounted(() => {
  teamsStore.init();
  resultsStore.init();
  workoutStore.init();
});

const leaderboardByCategory = computed(() =>
  computeLeaderboardByCategory(teamsStore.teams, resultsStore.results),
);
const leaderboardLoading = computed(() => teamsStore.loading || resultsStore.loading);
const categories = [
  { key: 'men' as Category, label: 'Men + Men', icon: '💪' },
  { key: 'women' as Category, label: 'Women + Women', icon: '🎀' },
];

type EventFilter = 'overall' | 'snatch' | 'clean' | 'wod';
const eventFilter = ref<EventFilter>('overall');
const eventFilters = [
  { key: 'overall' as EventFilter, label: 'Overall' },
  { key: 'snatch' as EventFilter, label: 'Snatch' },
  { key: 'clean' as EventFilter, label: 'Clean & Jerk' },
  { key: 'wod' as EventFilter, label: 'WOD' },
];
const filterDescriptions: Record<EventFilter, string> = {
  overall: 'Combined placing across all events.',
  snatch: 'Sorted by combined snatch total (highest first).',
  clean: 'Sorted by combined clean & jerk total.',
  wod: 'Sorted by fastest workout time.',
};
const currentFilterDescription = computed(
  () => filterDescriptions[eventFilter.value] ?? 'Division standings.',
);

const getEntries = (category: Category) => {
  // apply sorting for the selected leaderboard filter without mutating original list
  const base = [...(leaderboardByCategory.value[category] ?? [])];
  switch (eventFilter.value) {
    case 'snatch':
      return base.sort((a, b) => b.snatchTotal - a.snatchTotal);
    case 'clean':
      return base.sort((a, b) => b.cleanTotal - a.cleanTotal);
    case 'wod':
      return base.sort((a, b) => {
        if (a.wodSeconds === null) return 1;
        if (b.wodSeconds === null) return -1;
        return a.wodSeconds - b.wodSeconds;
      });
    default:
      return base.sort((a, b) => a.rank - b.rank);
  }
};
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Live leaderboard"
      title="LiftOff Leaderboard"
      subtitle="Follow every snatch, clean & jerk, and snowy WOD finish live from the North Pole arena."
    />

    <SectionCard>
      <div class="space-y-4">
        <p class="text-sm uppercase tracking-[0.3em] text-white/60">This year’s WOD</p>
        <template v-if="workoutStore.loading">
          <StateMessage title="Loading workout..." icon="🏋️" />
        </template>
        <template v-else-if="workoutStore.error">
          <StateMessage
            title="Unable to load workout"
            :message="workoutStore.error"
            icon="⚠️"
            variant="error"
          />
        </template>
        <template v-else-if="!workoutStore.workout">
          <StateMessage
            title="Workout pending"
            message="Hang tight while Santa finalizes the snowy standards."
            icon="❄️"
          />
        </template>
        <div v-else class="grid gap-4 md:grid-cols-3">
          <div class="md:col-span-2 space-y-2">
            <h2 class="font-display text-2xl">Description</h2>
            <p class="text-sm text-white/80 whitespace-pre-line">
              {{ workoutStore.workout.description }}
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 p-4">
            <p class="text-xs uppercase tracking-[0.3em] text-white/70">Standards</p>
            <p class="text-sm text-white/80 whitespace-pre-line mb-4">
              {{ workoutStore.workout.standards }}
            </p>
            <p class="text-xs uppercase tracking-[0.2em] text-white/70">Time Cap</p>
            <p class="text-2xl font-semibold text-festive-gold">
              {{ workoutStore.workout.timeCap }}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>

    <div class="flex flex-wrap gap-3 items-center">
      <button
        v-for="filter in eventFilters"
        :key="filter.key"
        class="rounded-full border px-4 py-2 text-sm font-semibold transition"
        :class="
          eventFilter === filter.key
            ? 'border-white/40 bg-white/25 text-white shadow-glow'
            : 'border-white/10 bg-black/30 text-white/70'
        "
        type="button"
        @click="eventFilter = filter.key"
      >
        {{ filter.label }}
      </button>
      <span class="text-xs uppercase tracking-[0.3em] text-white/60">
        {{ currentFilterDescription }}
      </span>
    </div>

    <div class="space-y-6">
      <SectionCard
        v-for="category in categories"
        :key="category.key"
        class="w-full"
      >
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-white/60">
              {{ category.label }}
            </p>
            <h2 class="font-display text-3xl flex items-center gap-2">
              <span>{{ category.icon }}</span> Division Standings
            </h2>
          </div>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {{ getEntries(category.key).length }} Teams
          </span>
        </div>
        <template v-if="leaderboardLoading">
          <StateMessage title="Crunching the latest lifts..." icon="🎅" />
        </template>
        <template v-else-if="resultsStore.error || teamsStore.error">
          <StateMessage
            title="Unable to load leaderboard"
            :message="resultsStore.error ?? teamsStore.error ?? ''"
            icon="⚠️"
            variant="error"
          />
        </template>
        <template v-else-if="!teamsStore.teams.length">
          <StateMessage
            title="No teams yet"
            message="Once competitors register, standings will appear."
            icon="📝"
          />
        </template>
        <template v-else-if="!getEntries(category.key).length">
          <StateMessage
            title="No scores yet"
            message="This division is still waiting for its first lifts."
            icon="⏱️"
          />
        </template>
        <div v-else class="overflow-x-auto">
          <LeaderboardTable :entries="getEntries(category.key)" />
        </div>
      </SectionCard>
    </div>
  </div>
</template>
