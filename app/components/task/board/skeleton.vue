<template>
  <!-- Column Headers  -->
  <div class="flex *:flex-1 gap-x-4 mb-4 animate-pulse">
    <div v-for="i in 5" :key="i">
      <div class="h-8 bg-gray-200 rounded mb-2" />
      <div class="h-1 bg-gray-300 rounded" />
    </div>
  </div>

  <!-- Columns Body -->
  <div class="flex gap-x-4">
    <div
      v-for="i in 5"
      :key="i"
      class="flex-1 flex flex-col gap-4 animate-pulse"
    >
      <div v-for="j in 2" :key="j" class="bg-white rounded-lg shadow p-4">
        <TaskCardSkeleton/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
