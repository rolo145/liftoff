<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import PageHero from "@/components/layout/PageHero.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import ScheduleCard from "@/components/schedule/ScheduleCard.vue";
import { useScheduleStore } from "@/stores/schedule";
import { useTeamsStore } from "@/stores/teams";
import type { Category } from "@/types";

const scheduleStore = useScheduleStore();
const teamsStore = useTeamsStore();
const searchQuery = ref("");

onMounted(() => {
  teamsStore.init();
  scheduleStore.init();
});

const getScheduleEntry = (team: (typeof teamsStore.teams)[number]) => ({
  team,
  slot: scheduleStore.slots.find((entry) => entry.teamId === team.id),
});

const scheduleByCategory = computed(() => {
  const grouped: Record<Category, ReturnType<typeof getScheduleEntry>[]> = {
    men: [],
    women: [],
  };
  filteredTeams.value.forEach((team) => {
    grouped[team.category]?.push(getScheduleEntry(team));
  });
  return grouped;
});

const categories = [
  { key: "men" as Category, label: "Men + Men", icon: "💪" },
  { key: "women" as Category, label: "Women + Women", icon: "🎀" },
];

const parseTimeToMinutes = (time?: string) => {
  if (!time) {
    return Number.POSITIVE_INFINITY;
  }
  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number.parseInt(hoursRaw ?? "", 10);
  const minutes = Number.parseInt(minutesRaw ?? "", 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return Number.POSITIVE_INFINITY;
  }
  return hours * 60 + minutes;
};

const getSchedule = (category: Category) => {
  const entries = scheduleByCategory.value[category] ?? [];
  return [...entries].sort(
    (a, b) => parseTimeToMinutes(a.slot?.snatchTime) - parseTimeToMinutes(b.slot?.snatchTime),
  );
};
const filteredTeams = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) { return teamsStore.teams; }
  return teamsStore.teams.filter((team) => {
    const haystack = `${team.athlete1} ${team.athlete2}`.toLowerCase();
    return haystack.includes(query);
  });
});
const noResultsMessage = computed(() =>
  searchQuery.value.trim()
    ? "No teams match this search."
    : "Once the roster is set, heats will appear.",
);
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Schedule"
      title="Event Timeline"
      subtitle="Lifts kick off right after sunrise on the North Pole – keep up with every lane assignment."
    />
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-white/70">
        Showing {{ filteredTeams.length }} teams
      </p>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search team or athlete"
        class="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-festive-mint/60 sm:w-72"
      />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <SectionCard
        v-for="category in categories"
        :key="category.key">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display text-3xl flex items-center gap-2">
            <span>{{ category.icon }}</span> {{ category.label }}
          </h2>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {{ getSchedule(category.key).length }} Teams
          </span>
        </div>
        <div class="mt-6 space-y-6">
          <template v-if="scheduleStore.loading || teamsStore.loading">
            <StateMessage
              title="Loading schedule..."
              icon="🕒" />
          </template>
          <template v-else-if="scheduleStore.error || teamsStore.error">
            <StateMessage
              title="Unable to load schedule"
              :message="scheduleStore.error ?? teamsStore.error ?? ''"
              icon="⚠️"
              variant="error"
            />
          </template>
          <template v-else-if="!getSchedule(category.key).length">
            <StateMessage
              title="No teams"
              :message="noResultsMessage"
              icon="🛷" />
          </template>
          <div
            v-else
            class="space-y-4">
            <ScheduleCard
              v-for="entry in getSchedule(category.key)"
              :key="entry.team.id"
              :scheduleSlot="entry.slot"
              :team="entry.team"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
</template>
