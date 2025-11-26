<template>
  <div>
    <div
      class="relative font-semibold px-2 pt-4 pb-2.5 bg-white shadow-xs before:top-0 before:left-0 before:absolute before:w-full before:h-2"
      :class="variantColors[variant]"
    >
      <h4>{{ heading }}</h4>
    </div>

    <div class="my-4 select-none bg-transparent border-1 border-slate-500 text-slate-500 hover:border-slate-500/30 hover:text-slate-500/30 text-center font-bold text-xs uppercase p-1.5">
      <span>Drop your task here</span>
    </div>
  </div>
</template>

<script setup lang="ts">
type ColumnHeaderProps = {
  heading: string;
  variant: TaskState
}

export type TaskState = 'pending' | 'waiting' | 'in_progress' | 'in_review' | 'completed'
defineProps<ColumnHeaderProps>()

const variantColors: Record<ColumnHeaderProps['variant'], string> = {
  pending: 'before:bg-slate-700',
  waiting: 'before:bg-red-500',
  in_progress: 'before:bg-blue-500',
  in_review: 'before:bg-yellow-500',
  completed: 'before:bg-green-500',
}
</script>
