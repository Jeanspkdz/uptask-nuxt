<template>
  <article class="shadow-sm bg-white pl-4 pr-3 py-3 flex flex-col">
    <div class="flex-1 flex gap-x-1.5">
      <h4
        class="flex-1 font-bold text-xl text-slate-700 text-balance"
        data-draggable
      >
        {{ task.name }}
      </h4>
      <TaskCardActions
        :task="task"
      />
    </div>

    <div data-draggable class="">
      <p class="mt-4 text-base">{{ task.description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Task } from '~~/server/types'

defineProps<{
  task: Task;
}>()
</script>

<style scoped></style>
