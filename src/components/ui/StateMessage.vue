<script setup lang="ts">
import { computed } from "vue";

type Variant = "info" | "error" | "success";

const props = defineProps<{
  title: string,
  message?: string,
  icon?: string,
  variant?: Variant,
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case "error":
      return "border-red-400/50 bg-red-900/30 text-red-100";
    case "success":
      return "border-emerald-400/50 bg-emerald-900/30 text-emerald-100";
    default:
      return "border-white/20 bg-black/40 text-white";
  }
});
</script>

<template>
  <div
    class="rounded-2xl border px-5 py-4 text-center backdrop-blur"
    :class="variantClasses">
    <div class="text-2xl">
      {{ icon ?? "✨" }}
    </div>
    <p class="text-lg font-semibold">
      {{ title }}
    </p>
    <p
      v-if="message"
      class="text-sm opacity-80">
      {{ message }}
    </p>
  </div>
</template>
