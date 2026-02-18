<template>
  <div class="flex flex-col">
    <h3 class="text-base font-bold text-gray-900 mb-3">Task Notes:</h3>

    <NoteListSkeleton v-if="isLoading" />

    <template v-else-if="notes && notes.length > 0">
      <NoteListItem
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :project-id="projectId"
        :can-delete="canDelete(note.owner.id)"
        @delete-note="emit('delete-note', $event)"
      />
    </template>

    <p v-else class="text-sm text-gray-400">There is no task notes yet</p>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '../project/card/index.vue'

const props = defineProps<{
  isLoading: boolean;
  notes: Array<TaskNote & { owner: { name: string; id: string } }> | undefined;
  currentUserId?: string;
  projectId: string;
  userRole: UserRole;
}>()

const emit = defineEmits<{
  'delete-note': [noteId: string];
}>()

const canDelete = (noteOwnerId: string) =>
  noteOwnerId === props.currentUserId || props.userRole === 'manager'
</script>
