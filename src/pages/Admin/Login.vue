<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHero from "@/components/layout/PageHero.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const redirectPath = (route.query.redirect as string) ?? "/admin/dashboard";

onMounted(() => {
  authStore.init();
});

watch(
  () => authStore.isAdmin,
  (isAdmin) => {
    if (isAdmin) {
      router.replace(redirectPath);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-6 text-white">
    <PageHero
      badge="Admin"
      title="LiftOff Control Room"
      subtitle="Google-authenticated elves only! Manage teams, workouts, and scoring."
    />
    <SectionCard>
      <div class="space-y-6 text-center">
        <p class="text-sm text-white/70">
          Only the gym-approved Google accounts can enter the dashboard. Reach out to the
          competition director if you need access.
        </p>
        <button
          class="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-3 text-center font-semibold text-festive-red transition hover:scale-[1.01]"
          type="button"
          :disabled="authStore.loading"
          @click="authStore.signInWithGoogle"
        >
          <span class="text-lg">🎅</span>
          {{ authStore.loading ? 'Preparing sleigh...' : 'Sign in with Google' }}
        </button>

        <StateMessage
          v-if="authStore.error"
          title="Login issue"
          :message="authStore.error"
          icon="⚠️"
          variant="error"
        />
      </div>
    </SectionCard>
  </div>
</template>
