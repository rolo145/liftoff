<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue';
import PageHero from '@/components/layout/PageHero.vue';
import SectionCard from '@/components/ui/SectionCard.vue';
import StateMessage from '@/components/ui/StateMessage.vue';
import { useWorkoutStore } from '@/stores/workout';
import AdminBackLink from '@/components/admin/AdminBackLink.vue';

const workoutStore = useWorkoutStore();
const form = reactive({
  description: '',
  standards: '',
  timeCap: '',
});
const saving = ref(false);
const feedback = ref<string | null>(null);

onMounted(() => {
  workoutStore.init();
});

watch(
  () => workoutStore.workout,
  (value) => {
    if (!value) return;
    form.description = value.description;
    form.standards = value.standards;
    form.timeCap = value.timeCap;
  },
  { immediate: true },
);

const handleSubmit = async () => {
  saving.value = true;
  feedback.value = null;
  try {
    await workoutStore.saveWorkout({
      description: form.description,
      standards: form.standards,
      timeCap: form.timeCap,
    });
    feedback.value = 'Workout updated!';
  } catch (error) {
    feedback.value =
      error instanceof Error ? error.message : 'Unable to save workout right now.';
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Admin"
      title="Workout Editor"
      subtitle="Set the workout description, standards, and official time cap."
    />
    <div class="flex justify-end">
      <AdminBackLink />
    </div>
    <SectionCard>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <label class="block space-y-2">
          <span class="text-xs uppercase text-white/60">Description</span>
          <textarea
            v-model="form.description"
            rows="5"
            class="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
            required
          ></textarea>
        </label>
        <label class="block space-y-2">
          <span class="text-xs uppercase text-white/60">Standards</span>
          <textarea
            v-model="form.standards"
            rows="4"
            class="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
            required
          ></textarea>
        </label>
        <label class="block space-y-2">
          <span class="text-xs uppercase text-white/60">Time Cap</span>
          <input
            v-model="form.timeCap"
            placeholder="15:00"
            class="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
            required
          />
        </label>
        <button
          class="rounded-full bg-festive-red px-6 py-3 font-semibold text-white"
          type="submit"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save Workout' }}
        </button>
        <StateMessage
          v-if="feedback"
          :title="feedback"
          icon="✅"
          variant="success"
        />
      </form>
    </SectionCard>
  </div>
</template>
