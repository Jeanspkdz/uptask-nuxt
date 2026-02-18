<template>
  <form @submit="handleCreateNote">
    <VeeField v-slot="{ field, errors }" name="noteDescription">
      <Field>
        <FieldLabel class="font-bold">Create Note</FieldLabel>
        <Input placeholder="Note Content" v-bind="field" />

        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <Field class="mt-4">
      <Button type="submit" :disabled="!meta.valid || isSubmitting">
        Create Note
      </Button>
    </Field>
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'

const { projectId, taskId } = defineProps<{
  projectId: string
  taskId: string
}>()

const emit = defineEmits<{
  'create-note': [note: TaskNote ]
}>()

const createNoteSchema = toTypedSchema(
  z.object({
    noteDescription: z
      .string({ error: 'Note description must be a string' })
      .min(8, { error: 'Note description must be at least 8 characters long' })
      .max(500, { error: 'Note description cannot exceed 500 characters' })
      .trim(),
  })
)

const { handleSubmit, meta, isSubmitting } = useForm({
  validationSchema: createNoteSchema,
  initialValues: {
    noteDescription: '',
  },
})

const handleCreateNote = handleSubmit(async (val, actions) => {
  try {
    await $fetch(`/api/project/${projectId}/task/${taskId}/note`, {
      method: 'POST',
      body: {
        description: val.noteDescription,
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          console.log('NOTE', response)

          toast.success('Note created successfully!')
          actions.resetForm()
          emit('create-note', response._data.insertedNote)
          return
        }
        toast.error(getErrorMessage(response._data.data.scope, response._data.data.code))
      },
    })
  } catch (error) {
    console.log('[CREATE_NOTE_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
})

</script>

<style scoped></style>
