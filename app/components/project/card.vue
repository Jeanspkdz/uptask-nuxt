<template>
  <article class="bg-white shadow-md py-6 px-4">
    <Badge
      class="uppercase px-4 mb-0.5"
      :class="{
        'text-blue-800 border-blue-800 bg-blue-600/10 font-bold border-2':
          role === 'manager',
        'text-emerald-800 border-emerald-800 bg-emerald-600/10':
          role === 'collaborator',
      }"
    >
      {{ role }}
    </Badge>

    <div class="flex justify-between">
      <div class="flex flex-col gap-1.5">
        <h4 class="text-2xl font-bold">{{ title }}</h4>
        <p class="text-zinc-400 text-sm font-bold">
          Cliente: <span> {{ clientName }}</span>
        </p>
        <p class="text-zinc-400 text-sm font-bold">{{ description }}</p>
      </div>

      <Button variant="ghost">
        <EllipsisVertical class="text-zinc-400 size-[20px]" />
      </Button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'

// types
export type UserRole = 'manager' | 'collaborator'

defineProps<{
  title: string;
  clientName: string;
  description: string;
  role: UserRole;
}>()

</script>

<style scoped></style>
