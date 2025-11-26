<template>
  <article class="shadow-sm bg-white pl-4 pr-3 py-3 flex ">
    <div data-draggable class="flex-1">
      <h4 class="font-bold text-xl text-slate-700 text-balance">{{ name }}</h4>
      <p class="mt-4 text-base">{{ description }}</p>
    </div>

    <div class="self-start">
      <TaskCardActions/>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
}>()
</script>

<style scoped>

</style>
