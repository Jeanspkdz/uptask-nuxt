<template>
  <div class="flex flex-col">
    <div
      v-for="i in 3"
      :key="i"
      class="flex items-center justify-between gap-4 py-3 border-b border-gray-200 last:border-none"
    >
      <div class="flex flex-col gap-1.5 flex-1">
        <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
        <div class="h-2 bg-gray-100 rounded animate-pulse w-1/4" />
      </div>
      <div class="h-6 w-16 bg-gray-200 rounded animate-pulse shrink-0" />
    </div>
  </div>
</template>
