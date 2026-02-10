<template>
  <article class="shadow-sm bg-white pl-4 pr-3 py-3 flex flex-col">
    <div class="flex-1 flex gap-x-1.5  relative pr-10">
      <h4
        class="font-bold text-xl text-slate-700 text-balance"
        data-draggable
      >
        {{ task.name }}
      </h4>
      <TaskCardActions
        :task="task"
        :user-role="userRole"
        class="absolute top-0 right-0"
      />
    </div>

    <div data-draggable class="">
      <p class="mt-4 text-base">{{ task.description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { UserRole } from '~/components/project/card/index.vue'

defineProps<{
  task: ProjectTask;
  userRole: UserRole
}>()
</script>

<style scoped></style>
