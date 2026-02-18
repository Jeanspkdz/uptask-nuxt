<template>
  <div
    class="flex items-center justify-between gap-4 py-3 border-b border-gray-200 last:border-none"
  >
    <div class="flex flex-col gap-0.5">
      <p class="text-sm text-gray-900">
        {{ note.description }} by:
        <strong class="font-semibold">{{ note.owner.name }}</strong>
      </p>
      <NuxtTime
        :datetime="note.createdAt"
        year="numeric"
        month="long"
        day="numeric"
        class="text-xs text-slate-500/65 font-semibold"
      />
    </div>

    <NoteListItemButtonDelete
      v-if="canDelete"
      :note-id="note.id"
      :task-id="note.taskId"
      :project-id="projectId"
      @delete-note="(e) => $emit('delete-note', e)"
    />
  </div>
</template>

<script setup lang="ts">

defineProps<{
  note: TaskNote & { owner: { name: string; id: string } };
  canDelete?: boolean;
  projectId: string;
}>()

defineEmits<{
  'delete-note': [noteId: string];
}>()
</script>
