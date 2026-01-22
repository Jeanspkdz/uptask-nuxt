<template>
  <div>
    <div>
      <form @submit="handleEditTask">
        <FieldSet>
          <DialogHeader>
            <DialogTitle as-child>
              <FieldLegend class="text-3xl font-bold mb-0"
                >Edit Task</FieldLegend
              >
            </DialogTitle>
            <DialogDescription as-child>
              <FieldDescription class="font-bold text-lg text-black">
                Make changes to the task using
                <span class="text-fuchsia-600">this form</span>
              </FieldDescription>
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="name">
              <Field>
                <FieldLabel>Task Name</FieldLabel>
                <Input placeholder="Your Task Name" v-bind="field" />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="description">
              <Field>
                <FieldLabel>Task Description</FieldLabel>
                <Textarea
                  placeholder="Your Task Description"
                  v-bind="field"
                  class="resize-none field-sizing-content"
                  :rows="5"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <Button type="submit" :disabled="!meta.dirty || isSubmitting">
            Save Task
          </Button>
        </FieldSet>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { getErrorMessage } from '~/errors'
const props = defineProps<{
  taskId: string
  name: string;
  description: string;
}>()

const route = useRoute()
const projectId = route.params.projectId as string
const projectTasksProvider = inject(projectTasksKey)

const editTaskSchema = z.object({
  name: z.string().min(1, { error: 'A name is required' }),
  description: z
    .string()
    .min(8, { error: 'Description must be at least 8 characters long' }),
})

const { handleSubmit, meta, isSubmitting } = useForm({
  validationSchema: toTypedSchema(editTaskSchema),
  initialValues: {
    name: props.name,
    description: props.description,
  },
})

const handleEditTask = handleSubmit(async (values) => {
  try {
    await $fetch(`/api/project/${projectId}/task/${props.taskId}`, {
      method: 'PUT',
      body: {
        ...values
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Task Updated Successfully!!')
          projectTasksProvider?.updateProjectTask(props.taskId, values)
          return
        }
        toast.error(getErrorMessage(response._data.data.scope, response._data.data.code))
      },
    })
  } catch (error) {
    console.log('[UPDATE_TASK_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
})
</script>

<style scoped></style>
