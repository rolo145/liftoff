<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PageHero from '@/components/layout/PageHero.vue';
import SectionCard from '@/components/ui/SectionCard.vue';
import StateMessage from '@/components/ui/StateMessage.vue';
import TeamCard from '@/components/teams/TeamCard.vue';
import { useTeamsStore } from '@/stores/teams';

const teamsStore = useTeamsStore();
const searchQuery = ref('');

onMounted(() => {
  teamsStore.init();
});

const filteredTeams = computed(() => {
  // search by team or athlete name
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return teamsStore.teams;
  return teamsStore.teams.filter((team) => {
    const haystack = `${team.name} ${team.athlete1} ${team.athlete2}`.toLowerCase();
    return haystack.includes(query);
  });
});

const menTeams = computed(() => filteredTeams.value.filter((team) => team.category === 'men'));
const womenTeams = computed(() =>
  filteredTeams.value.filter((team) => team.category === 'women'),
);
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Teams"
      title="Meet the LiftOff Crews"
      subtitle="Duos ready to brave the snow, barbells, and twinkling lights."
    />

    <SectionCard>
      <div class="space-y-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-display text-3xl">Athlete Roster</h2>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              {{ filteredTeams.length }} Teams visible
            </span>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search team or athlete"
            class="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-festive-mint/60 sm:w-72"
          />
        </div>
        <template v-if="teamsStore.loading">
          <StateMessage title="Loading teams..." icon="🎽" />
        </template>
        <template v-else-if="teamsStore.error">
          <StateMessage
            title="Unable to load teams"
            :message="teamsStore.error"
            icon="⚠️"
            variant="error"
          />
        </template>
        <template v-else-if="!teamsStore.teams.length">
          <StateMessage
            title="No teams yet"
            message="As soon as Santa approves the registrations they'll appear here."
            icon="📝"
          />
        </template>
        <template v-else-if="!filteredTeams.length">
          <StateMessage title="No teams match" message="Try another search phrase." icon="🔍" />
        </template>
        <div v-else class="space-y-8">
          <section>
            <header class="mb-4 flex items-center gap-2">
              <span class="text-2xl">💪</span>
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Men + Men</p>
                <p class="text-lg font-semibold">{{ menTeams.length }} Teams</p>
              </div>
            </header>
            <template v-if="menTeams.length">
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <TeamCard v-for="team in menTeams" :key="team.id" :team="team" />
              </div>
            </template>
            <StateMessage
              v-else
              title="No teams match"
              message="Try adjusting your search."
              icon="🔍"
            />
          </section>
          <section>
            <header class="mb-4 flex items-center gap-2">
              <span class="text-2xl">🎀</span>
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Women + Women</p>
                <p class="text-lg font-semibold">{{ womenTeams.length }} Teams</p>
              </div>
            </header>
            <template v-if="womenTeams.length">
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <TeamCard v-for="team in womenTeams" :key="team.id" :team="team" />
              </div>
            </template>
            <StateMessage
              v-else
              title="No teams match"
              message="Try adjusting your search."
              icon="🔍"
            />
          </section>
        </div>
      </div>
    </SectionCard>
  </div>
</template>
