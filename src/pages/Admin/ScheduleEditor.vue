<script setup lang="ts">
import {
  computed, onMounted, reactive, ref, watch,
} from "vue";
import PageHero from "@/components/layout/PageHero.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useTeamsStore } from "@/stores/teams";
import { useScheduleStore } from "@/stores/schedule";
import AdminBackLink from "@/components/admin/AdminBackLink.vue";

interface ScheduleForm {
  snatchTime: string,
  cleanJerkTime: string,
  wodTime: string,
}

const teamsStore = useTeamsStore();
const scheduleStore = useScheduleStore();
const forms = reactive<Record<string, ScheduleForm>>({});
const saving = ref<string | null>(null);
const toast = ref<string | null>(null);
const searchQuery = ref("");

onMounted(() => {
  teamsStore.init();
  scheduleStore.init();
});

const defaultForm = (): ScheduleForm => ({
  snatchTime: "",
  cleanJerkTime: "",
  wodTime: "",
});

const syncForms = () => {
  // hydrate the local form map with the latest Firestore values
  teamsStore.teams.forEach((team) => {
    const slot = scheduleStore.slots.find((entry) => entry.teamId === team.id);
    forms[team.id] = slot
      ? {
          snatchTime: slot.snatchTime,
          cleanJerkTime: slot.cleanJerkTime,
          wodTime: slot.wodTime,
        }
      : defaultForm();
  });
};

watch(
  () => [teamsStore.teams, scheduleStore.slots],
  () => syncForms(),
  { deep: true, immediate: true },
);

const saveSlot = async (teamId: string) => {
  const payload = forms[teamId] ?? defaultForm();
  saving.value = teamId;
  toast.value = null;
  try {
    await scheduleStore.saveSlot({ teamId, ...payload });
    toast.value = "Schedule updated!";
  } catch (error) {
    toast.value = error instanceof Error ? error.message : "Unable to save schedule.";
  } finally {
    saving.value = null;
  }
};

const filteredTeams = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) { return teamsStore.teams; }
  return teamsStore.teams.filter((team) => {
    const haystack = `${team.athlete1} ${team.athlete2}`.toLowerCase();
    return haystack.includes(query);
  });
});
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Admin"
      title="Schedule Editor"
      subtitle="Assign lift attempts and WOD start times to each team."
    />
    <div class="flex justify-end">
      <AdminBackLink />
    </div>
    <SectionCard>
      <div
        v-if="!teamsStore.loading"
        class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-white/70">
          Editing schedule for {{ filteredTeams.length }} teams
        </p>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search team or athlete"
          class="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-festive-mint/60 sm:w-72"
        />
      </div>
      <template v-if="teamsStore.loading || scheduleStore.loading">
        <StateMessage
          title="Loading schedule..."
          icon="🎅" />
      </template>
      <template v-else-if="teamsStore.error || scheduleStore.error">
        <StateMessage
          title="Unable to load schedule"
          :message="teamsStore.error ?? scheduleStore.error ?? ''"
          icon="⚠️"
          variant="error"
        />
      </template>
      <template v-else-if="!teamsStore.teams.length">
        <StateMessage
          title="No teams yet"
          message="Create teams first."
          icon="📝"
        />
      </template>
      <template v-else-if="!filteredTeams.length">
        <StateMessage
          title="No teams match"
          message="Adjust your search and try again."
          icon="🔍"
        />
      </template>
      <div
        v-else
        class="space-y-4">
        <article
          v-for="team in filteredTeams"
          :key="team.id"
          class="rounded-3xl border border-white/10 bg-white/5 p-4"
        >
          <header class="mb-3 flex items-center justify-between">
            <div>
              <p class="text-xs uppercase text-white/60">
                {{ team.category === 'men' ? 'Men + Men' : 'Women + Women' }}
              </p>
              <p class="text-lg font-semibold">
                {{ team.athlete1 }} • {{ team.athlete2 }}
              </p>
            </div>
          </header>
          <form
            v-if="forms[team.id]"
            class="grid gap-3 md:grid-cols-3"
            @submit.prevent="saveSlot(team.id)"
          >
            <label class="space-y-1">
              <span class="text-xs uppercase text-white/50">Snatch Time</span>
              <input
                v-model="forms[team.id]!.snatchTime"
                type="time"
                class="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
                required
              />
            </label>
            <label class="space-y-1">
              <span class="text-xs uppercase text-white/50">Clean &amp; Jerk</span>
              <input
                v-model="forms[team.id]!.cleanJerkTime"
                type="time"
                class="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
                required
              />
            </label>
            <label class="space-y-1">
              <span class="text-xs uppercase text-white/50">WOD Time</span>
              <input
                v-model="forms[team.id]!.wodTime"
                type="time"
                class="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
                required
              />
            </label>
            <div class="md:col-span-3 flex justify-end">
              <button
                class="rounded-full bg-festive-red px-5 py-2 text-sm font-semibold text-white"
                type="submit"
                :disabled="saving === team.id"
              >
                {{ saving === team.id ? 'Saving...' : 'Save Slot' }}
              </button>
            </div>
          </form>
        </article>
      </div>
      <StateMessage
        v-if="toast"
        class="mt-4"
        :title="toast"
        icon="✅"
        variant="success"
      />
    </SectionCard>
  </div>
</template>
