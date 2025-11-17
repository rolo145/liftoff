<template>
<section
  class="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/40"
>
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]"
    ></div>
    <div class="relative z-10">
      <slot />
    </div>
  </section>
</template>
