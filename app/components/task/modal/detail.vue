<template>
  <div>
    <div class="text-slate-500/65 font-semibold leading-snug mb-6">
      <p>
        Created at
        <NuxtTime
          :datetime="taskDetails.createdAt"
          locale="en-US"
          month="short"
          year="numeric"
          day="2-digit"
        />
      </p>
      <p>
        Lastest update :
        <NuxtTime
          :datetime="taskDetails.updatedAt ?? taskDetails.createdAt"
          locale="en-US"
          month="short"
          year="numeric"
          day="2-digit"
        />
      </p>
    </div>

    <div>
      <DialogHeader>
        <DialogTitle class="text-3xl font-bold">{{
          taskDetails.name
        }}</DialogTitle>
        <DialogDescription class="font-bold text-lg text-slate-500">
          {{ taskDetails.description }}
        </DialogDescription>
      </DialogHeader>

      <Label class="mt-7 font-bold">Current State</Label>
      <TaskStateSelect
        :task-state="taskDetails.state"
        :task-id="taskDetails.id"
        @task-state-change="handleUpdateTaskState"
      />

      <NoteFormCreate
        :project-id="projectId"
        :task-id="taskDetails.id"
        @create-note="(e) => handleCreateNote(e)"
      />
      <NoteList
        class="mt-5"
        :notes="notes"
        :is-loading="isNotesPending"
        :current-user-id="authStore.user?.id"
        :project-id="projectId"
        :user-role="project?.userRole ?? 'collaborator'"
        @delete-note="handleDeleteNote"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { taskDetails } = defineProps<{
  taskDetails: Pick<
    ProjectTask,
    'id' | 'name' | 'state' | 'createdAt' | 'updatedAt' | 'description'
  >;
}>()
const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

const projectTasksProvider = inject(projectTasksKey)
const handleUpdateTaskState = (
  taskId: string,
  state: TaskState,
  order: number
) => {
  projectTasksProvider?.updateProjectTask(taskId, { state, order })
}

const authStore = useAuthStore()
const { project } = useProject(() => projectId.value)

const { notes, isNotesPending, addNote, deleteNote } = useTaskNotes(
  () => projectId.value,
  () => taskDetails.id
)

const handleCreateNote = (note: TaskNote) => {
  if (authStore.user) {
    addNote({
      ...note,
      owner: {
        id: authStore.user?.id,
        name: authStore.user?.name,
      },
    })
  }
}

const handleDeleteNote = (noteId: string) => {
  deleteNote(noteId)
}
</script>

<style scoped></style>
