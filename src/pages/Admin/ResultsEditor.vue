<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import PageHero from '@/components/layout/PageHero.vue';
import SectionCard from '@/components/ui/SectionCard.vue';
import StateMessage from '@/components/ui/StateMessage.vue';
import { useTeamsStore } from '@/stores/teams';
import { useResultsStore } from '@/stores/results';
import type { ResultPayload } from '@/types';
import AdminBackLink from '@/components/admin/AdminBackLink.vue';

interface ResultForm {
  snatchAthlete1: number;
  snatchAthlete2: number;
  cleanAthlete1: number;
  cleanAthlete2: number;
  wodTime: string;
}

type Section = 'snatch' | 'clean' | 'wod';

const teamsStore = useTeamsStore();
const resultsStore = useResultsStore();
const forms = reactive<Record<string, ResultForm>>({});
const toast = ref<string | null>(null);
const savingState = reactive<Record<string, Record<Section, boolean>>>({});
const searchQuery = ref('');

onMounted(() => {
  teamsStore.init();
  resultsStore.init();
});

const buildForm = (): ResultForm => ({
  snatchAthlete1: 0,
  snatchAthlete2: 0,
  cleanAthlete1: 0,
  cleanAthlete2: 0,
  wodTime: '00:00',
});

const ensureSavingState = (teamId: string) => {
  if (!savingState[teamId]) {
    savingState[teamId] = {
      snatch: false,
      clean: false,
      wod: false,
    };
  }
  return savingState[teamId];
};

const syncForms = () => {
  // mirror Firestore snapshot into a local reactive map per team
  teamsStore.teams.forEach((team) => {
    const existing = resultsStore.results.find((result) => result.teamId === team.id);
    forms[team.id] = existing
      ? {
              snatchAthlete1: existing.snatchAthlete1,
              snatchAthlete2: existing.snatchAthlete2,
              cleanAthlete1: existing.cleanAthlete1,
          cleanAthlete2: existing.cleanAthlete2,
          wodTime: existing.wodTime,
        }
      : buildForm();
    ensureSavingState(team.id);
  });
};

watch(
  () => [teamsStore.teams, resultsStore.results],
  () => {
    syncForms();
  },
  { immediate: true, deep: true },
);

const filteredTeams = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return teamsStore.teams;
  return teamsStore.teams.filter((team) => {
    const haystack = `${team.name} ${team.athlete1} ${team.athlete2}`.toLowerCase();
    return haystack.includes(query);
  });
});

const saveSection = async (teamId: string, section: Section) => {
  const payload = forms[teamId] ?? buildForm();
  const sectionState = ensureSavingState(teamId);
  sectionState[section] = true;
  toast.value = null;

  const partial: Partial<ResultPayload> = {};
  if (section === 'snatch') {
    partial.snatchAthlete1 = payload.snatchAthlete1;
    partial.snatchAthlete2 = payload.snatchAthlete2;
  } else if (section === 'clean') {
    partial.cleanAthlete1 = payload.cleanAthlete1;
    partial.cleanAthlete2 = payload.cleanAthlete2;
  } else {
    partial.wodTime = payload.wodTime;
  }

  try {
    await resultsStore.savePartial(teamId, partial);
    toast.value =
      section === 'snatch'
        ? 'Snatch saved!'
        : section === 'clean'
          ? 'Clean & Jerk saved!'
          : 'WOD saved!';
  } catch (error) {
    toast.value = error instanceof Error ? error.message : 'Unable to save result.';
  } finally {
    sectionState[section] = false;
  }
};
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Admin"
      title="Results Editor"
      subtitle="Enter individual snatch and clean numbers and WOD finish times."
    />
    <div class="flex justify-end">
      <AdminBackLink />
    </div>
    <SectionCard>
      <div class="space-y-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-white/70">
            Manage results for {{ filteredTeams.length }} teams
          </p>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search team or athlete"
            class="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-festive-mint/60 sm:w-72"
          />
        </div>
        <template v-if="teamsStore.loading || resultsStore.loading">
          <StateMessage title="Loading data..." icon="💾" />
        </template>
        <template v-else-if="teamsStore.error || resultsStore.error">
          <StateMessage
            title="Unable to load results"
            :message="teamsStore.error ?? resultsStore.error ?? ''"
            icon="⚠️"
            variant="error"
          />
        </template>
        <template v-else-if="!teamsStore.teams.length">
          <StateMessage
            title="No teams yet"
            message="Create a team before logging scores."
            icon="📝"
          />
        </template>
        <template v-else-if="!filteredTeams.length">
          <StateMessage
            title="No teams match"
            message="Try a different search term."
            icon="🔍"
          />
        </template>
        <div v-else class="space-y-5">
          <article
            v-for="team in filteredTeams"
            :key="team.id"
            class="rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase text-white/60">
                  {{ team.category === 'men' ? 'Men + Men' : 'Women + Women' }}
                </p>
                <p class="text-lg font-semibold">{{ team.name }}</p>
              </div>
              <p class="text-sm text-white/70">{{ team.athlete1 }} • {{ team.athlete2 }}</p>
            </header>
            <div v-if="forms[team.id]" class="grid gap-4 md:grid-cols-3">
              <section class="rounded-2xl bg-black/30 p-4 space-y-3 border border-white/10">
                <div>
                  <p class="text-xs uppercase text-white/60 tracking-[0.2em]">Snatch</p>
                  <p class="text-sm text-white/70">Max lift per athlete (kg)</p>
                </div>
                <label class="space-y-1 block">
                  <span class="text-xs uppercase text-white/50">
                    {{ team.athlete1 }} – Snatch
                  </span>
                  <input
                    v-model.number="forms[team.id]!.snatchAthlete1"
                    type="number"
                    min="0"
                    class="w-full rounded-2xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                    required
                  />
                </label>
                <label class="space-y-1 block">
                  <span class="text-xs uppercase text-white/50">
                    {{ team.athlete2 }} – Snatch
                  </span>
                  <input
                    v-model.number="forms[team.id]!.snatchAthlete2"
                    type="number"
                    min="0"
                    class="w-full rounded-2xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                    required
                  />
                </label>
                <button
                  class="w-full rounded-full bg-festive-red px-4 py-2 text-sm font-semibold text-white"
                  type="button"
                  :disabled="savingState[team.id]?.snatch"
                  @click="saveSection(team.id, 'snatch')"
                >
                  {{ savingState[team.id]?.snatch ? 'Saving...' : 'Save Snatch' }}
                </button>
              </section>
              <section class="rounded-2xl bg-black/30 p-4 space-y-3 border border-white/10">
                <div>
                  <p class="text-xs uppercase text-white/60 tracking-[0.2em]">Clean &amp; Jerk</p>
                  <p class="text-sm text-white/70">Max lift per athlete (kg)</p>
                </div>
                <label class="space-y-1 block">
                  <span class="text-xs uppercase text-white/50">
                    {{ team.athlete1 }} – Clean &amp; Jerk
                  </span>
                  <input
                    v-model.number="forms[team.id]!.cleanAthlete1"
                    type="number"
                    min="0"
                    class="w-full rounded-2xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                    required
                  />
                </label>
                <label class="space-y-1 block">
                  <span class="text-xs uppercase text-white/50">
                    {{ team.athlete2 }} – Clean &amp; Jerk
                  </span>
                  <input
                    v-model.number="forms[team.id]!.cleanAthlete2"
                    type="number"
                    min="0"
                    class="w-full rounded-2xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                    required
                  />
                </label>
                <button
                  class="w-full rounded-full bg-festive-red px-4 py-2 text-sm font-semibold text-white"
                  type="button"
                  :disabled="savingState[team.id]?.clean"
                  @click="saveSection(team.id, 'clean')"
                >
                  {{ savingState[team.id]?.clean ? 'Saving...' : 'Save Clean & Jerk' }}
                </button>
              </section>
              <section class="rounded-2xl bg-black/30 p-4 space-y-3 border border-white/10">
                <div>
                  <p class="text-xs uppercase text-white/60 tracking-[0.2em]">WOD</p>
                  <p class="text-sm text-white/70">Insert final time (mm:ss)</p>
                </div>
                <label class="space-y-1 block">
                  <span class="text-xs uppercase text-white/50">Time</span>
                  <input
                    v-model="forms[team.id]!.wodTime"
                    pattern="\\d{1,2}:\\d{2}"
                    placeholder="14:32"
                    class="w-full rounded-2xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                    required
                  />
                </label>
                <button
                  class="w-full rounded-full bg-festive-red px-4 py-2 text-sm font-semibold text-white"
                  type="button"
                  :disabled="savingState[team.id]?.wod"
                  @click="saveSection(team.id, 'wod')"
                >
                  {{ savingState[team.id]?.wod ? 'Saving...' : 'Save WOD' }}
                </button>
              </section>
            </div>
          </article>
        </div>
        <StateMessage
          v-if="toast"
          :title="toast"
          icon="✅"
          variant="success"
        />
      </div>
    </SectionCard>
  </div>
</template>
