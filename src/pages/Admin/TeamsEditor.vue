<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import PageHero from "@/components/layout/PageHero.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useTeamsStore } from "@/stores/teams";
import type { Team, TeamPayload } from "@/types";
import AdminBackLink from "@/components/admin/AdminBackLink.vue";

const teamsStore = useTeamsStore();
const form = reactive<TeamPayload>({
  category: "men",
  athlete1: "",
  athlete2: "",
});
const activeTeamId = ref<string | null>(null);
const saving = ref(false);
const feedback = ref<string | null>(null);

onMounted(() => {
  teamsStore.init();
});

const resetForm = () => {
  form.category = "men";
  form.athlete1 = "";
  form.athlete2 = "";
  activeTeamId.value = null;
};

const startEdit = (team: Team) => {
  form.category = team.category;
  form.athlete1 = team.athlete1;
  form.athlete2 = team.athlete2;
  activeTeamId.value = team.id;
};

const handleSubmit = async () => {
  try {
    saving.value = true;
    feedback.value = null;
    if (activeTeamId.value) {
      await teamsStore.updateTeam(activeTeamId.value, form);
      feedback.value = "Team updated!";
    } else {
      await teamsStore.createTeam(form);
      feedback.value = "Team created!";
    }
    resetForm();
  } catch (error) {
    feedback.value
      = error instanceof Error ? error.message : "Unable to save team right now.";
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!id) { return; }
  saving.value = true;
  await teamsStore.deleteTeam(id);
  saving.value = false;
  if (activeTeamId.value === id) {
    resetForm();
  }
};
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Admin"
      title="Teams Editor"
      subtitle="Create teams, edit athletes, and keep the roster tidy."
    />
    <div class="flex justify-end">
      <AdminBackLink />
    </div>
    <SectionCard>
      <div class="space-y-5">
        <div class="flex flex-col gap-4 rounded-3xl bg-black/20 p-4 md:flex-row">
          <div class="flex-1 space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-white/60">
              Category
            </p>
            <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white">
              <input
                v-model="form.category"
                type="radio"
                value="men"
                class="accent-festive-red"
              />
              Men + Men
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white">
              <input
                v-model="form.category"
                type="radio"
                value="women"
                class="accent-festive-red"
              />
              Women + Women
            </label>
          </div>
          <form
            class="flex-1 space-y-4"
            @submit.prevent="handleSubmit">
            <label class="space-y-2 block">
              <span class="text-xs uppercase text-white/60">Athlete 1</span>
              <input
                v-model="form.athlete1"
                required
                class="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                placeholder="First athlete full name"
              />
            </label>
            <label class="space-y-2 block">
              <span class="text-xs uppercase text-white/60">Athlete 2</span>
              <input
                v-model="form.athlete2"
                required
                class="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                placeholder="Second athlete full name"
              />
            </label>
            <div class="flex flex-wrap gap-3 pt-2">
              <button
                class="rounded-full bg-festive-red px-6 py-3 font-semibold text-white"
                type="submit"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : activeTeamId ? 'Update Roster' : 'Create Roster' }}
              </button>
              <button
                v-if="activeTeamId"
                class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white"
                type="button"
                @click="resetForm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <StateMessage
          v-if="feedback"
          :title="feedback"
          icon="✅"
          variant="success"
        />
      </div>
    </SectionCard>
    <SectionCard>
      <div class="space-y-4">
        <h2 class="font-display text-2xl">
          Registered Teams
        </h2>
        <template v-if="teamsStore.loading">
          <StateMessage
            title="Loading teams..."
            icon="🎯" />
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
            message="Create the first team to get started."
            icon="📝"
          />
        </template>
        <div
          v-else
          class="grid gap-3">
          <article
            v-for="team in teamsStore.teams"
            :key="team.id"
            class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div>
              <p class="text-xs uppercase text-white/60">
                {{ team.category === 'men' ? 'Men + Men' : 'Women + Women' }}
              </p>
              <p class="text-sm text-white/70">
                {{ team.athlete1 }} • {{ team.athlete2 }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                class="rounded-full border border-white/30 px-4 py-2 text-sm"
                type="button"
                @click="startEdit(team)"
              >
                Edit
              </button>
              <button
                class="rounded-full border border-red-400/50 px-4 py-2 text-sm text-red-200"
                type="button"
                @click="handleDelete(team.id)"
              >
                Delete
              </button>
            </div>
          </article>
        </div>
      </div>
    </SectionCard>
  </div>
</template>
