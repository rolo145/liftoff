<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.push("/admin/dashboard");
};
</script>

<template>
  <button
    class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 backdrop-blur"
    type="button"
    @click="goBack"
  >
    <span aria-hidden="true">←</span>
    Back to dashboard
  </button>
</template>
