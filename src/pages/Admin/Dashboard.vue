<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import PageHero from "@/components/layout/PageHero.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useAuthStore } from "@/stores/auth";
import { useTeamsStore } from "@/stores/teams";
import { useResultsStore } from "@/stores/results";
import { useScheduleStore } from "@/stores/schedule";
import { useWorkoutStore } from "@/stores/workout";

const authStore = useAuthStore();
const teamsStore = useTeamsStore();
const resultsStore = useResultsStore();
const scheduleStore = useScheduleStore();
const workoutStore = useWorkoutStore();

onMounted(() => {
  teamsStore.init();
  resultsStore.init();
  scheduleStore.init();
  workoutStore.init();
});

const summary = computed(() => [
  { label: "Teams", value: teamsStore.teams.length, to: "/admin/dashboard/teams" },
  { label: "Results Logged", value: resultsStore.results.length, to: "/admin/dashboard/results" },
  { label: "Schedule Slots", value: scheduleStore.slots.length, to: "/admin/dashboard/schedule" },
  { label: "Workout Ready", value: workoutStore.workout ? "Yes" : "Draft", to: "/admin/dashboard/workout" },
]);
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Admin"
      title="Competition Dashboard"
      subtitle="Control teams, scoring, workouts, and schedule from one cozy HQ."
    >
      <button
        class="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
        type="button"
        @click="authStore.signOut"
      >
        Sign out
      </button>
    </PageHero>
    <SectionCard>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RouterLink
          v-for="item in summary"
          :key="item.label"
          :to="item.to"
          class="rounded-3xl border border-white/10 bg-white/5 p-4 text-center transition hover:bg-white/10"
        >
          <p class="text-xs uppercase tracking-[0.3em] text-white/60">
            {{ item.label }}
          </p>
          <p class="text-3xl font-bold">
            {{ item.value }}
          </p>
        </RouterLink>
      </div>
    </SectionCard>
    <SectionCard>
      <h2 class="font-display text-2xl mb-4">
        Quick Actions
      </h2>
      <div class="grid gap-4 md:grid-cols-2">
        <RouterLink
          to="/admin/dashboard/teams"
          class="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
        >
          <h3 class="text-xl font-semibold">
            Manage Teams
          </h3>
          <p class="text-sm text-white/70">
            Add, update, or remove teams, athletes, and categories.
          </p>
        </RouterLink>
        <RouterLink
          to="/admin/dashboard/results"
          class="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
        >
          <h3 class="text-xl font-semibold">
            Record Results
          </h3>
          <p class="text-sm text-white/70">
            Enter individual snatch & clean numbers plus WOD times.
          </p>
        </RouterLink>
        <RouterLink
          to="/admin/dashboard/workout"
          class="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
        >
          <h3 class="text-xl font-semibold">
            Edit Workout
          </h3>
          <p class="text-sm text-white/70">
            Publish description, standards, and time cap.
          </p>
        </RouterLink>
        <RouterLink
          to="/admin/dashboard/schedule"
          class="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
        >
          <h3 class="text-xl font-semibold">
            Set Schedule
          </h3>
          <p class="text-sm text-white/70">
            Assign lift attempts and WOD times for every team.
          </p>
        </RouterLink>
      </div>
      <StateMessage
        v-if="teamsStore.error || resultsStore.error"
        class="mt-6"
        title="Realtime data warning"
        :message="teamsStore.error ?? resultsStore.error ?? ''"
        icon="⚠️"
        variant="error"
      />
    </SectionCard>
  </div>
</template>
