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
        <DialogTitle class="text-3xl font-semibold mb-3">{{
          taskDetails.name
        }}</DialogTitle>
        <DialogDescription class="font-semibold text-lg text-slate-500">
          {{ taskDetails.description }}
        </DialogDescription>
      </DialogHeader>

      <Label class="mt-4 font-bold">Current State</Label>

      <Select v-model="taskNewState" class="">
        <SelectTrigger class="mt-3 w-full mb-4">
          <SelectValue placeholder="Update the task state" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>States</SelectLabel>
            <SelectItem
              v-for="(label, key) in taskStates"
              :key="key"
              :value="key"
            >
              {{ label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
import type { Task, TaskState } from '~~/server/types'

const props = defineProps<{
  taskDetails: Pick<
    Task,
    'name' | 'state' | 'createdAt' | 'updatedAt' | 'description'
  >;
}>()

watchEffect(() => {
  console.log('PROPS', props.taskDetails)
})

const taskNewState = ref(props.taskDetails.state)

const taskStates: Record<TaskState, string> = {
  pending: 'Pending',
  waiting: 'Waiting',
  in_progress: 'In Progress',
  in_review: 'In Review',
  completed: 'Completed',
}

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
</script>

<style scoped></style>
