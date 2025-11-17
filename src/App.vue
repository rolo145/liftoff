<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import MainNav from '@/components/layout/MainNav.vue';
import Snowfall from '@/components/decor/Snowfall.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// wire the auth listener once at the top level so every page reacts to login state
onMounted(() => {
  authStore.init();
});

const adminCtaText = computed(() => (authStore.isAdmin ? 'Dashboard' : 'Admin'));
const adminCtaDestination = computed(() =>
  authStore.isAdmin ? '/admin/dashboard' : '/admin/login',
);

const goToAdmin = () => {
  router.push(adminCtaDestination.value);
};
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-[#050102] text-white">
    <Snowfall />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]"
    ></div>
    <div class="relative z-10 flex min-h-screen flex-col">
      <header class="bg-gradient-to-b from-[#1c0308] via-[#2b080f] to-transparent shadow-glow">
        <MainNav />
      </header>
      <main class="flex-1 px-3 pb-16 pt-6 sm:px-6 lg:px-10">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
      <footer
        class="bg-[#140005]/80 py-8 text-center text-sm text-white/70 backdrop-blur flex flex-col items-center gap-3"
      >
        <div>
          <p class="font-display text-xl text-festive-gold drop-shadow">LiftOff</p>
          <p>Festive CrossFit Throwdown • Snow, Steel, and Smiles</p>
        </div>
        <button
          class="rounded-full border border-white/30 bg-gradient-to-r from-festive-red to-festive-dark px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-festive-red/30 transition hover:scale-[1.01]"
          type="button"
          @click="goToAdmin"
        >
          {{ adminCtaText }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
