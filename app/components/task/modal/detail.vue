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

      <form @submit="handleCreateNote">
        <VeeField v-slot="{ field, errors }" name="noteName">
          <Field>
            <FieldLabel class="font-bold">Create Note</FieldLabel>
            <Input placeholder="Note Content" v-bind="field" />

            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <Field class="mt-4">
          <Button type="submit" :disabled="!meta.valid"> Create Note </Button>
        </Field>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import z from 'zod'

defineProps<{
  taskDetails: Pick<
    ProjectTask,
    'id' | 'name' | 'state' | 'createdAt' | 'updatedAt' | 'description'
  >;
}>()

const createNoteSchema = toTypedSchema(
  z.object({
    noteName: z
      .string()
      .min(8, { error: 'A minimum length of 8 chracter is required' }),
  })
)

const { handleSubmit, meta } = useForm({
  validationSchema: createNoteSchema,
  initialValues: {
    noteName: '',
  },
  validateOnMount: false,
})

const handleCreateNote = handleSubmit((val) => {
  console.log(val)
})

const projectTasksProvider = inject(projectTasksKey)

const handleUpdateTaskState = (taskId: string, state: TaskState, order: number) => {
  projectTasksProvider?.updateProjectTask(taskId, { state, order })
}

</script>

<style scoped></style>
