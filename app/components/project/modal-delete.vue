<template>
  <div>
    <DialogTitle class="text-3xl font-bold"> Delete your Project </DialogTitle>
    <DialogDescription class="font-bold text-lg text-slate-500">
      Enter your password to delete your project
    </DialogDescription>

    <form class="mt-5" @submit="handleDeleteProject">
      <FieldGroup>
        <VeeField v-slot="{ field }" name="password">
          <Field>
            <Label class="text-lg">Password</Label>
            <InputGroup>
              <InputGroupAddon><Lock /></InputGroupAddon>
              <InputGroupInput
                placeholder="Enter your password"
                v-bind="field"
                type="password"
                autocomplete="current-password"
              />
            </InputGroup>
          </Field>
        </VeeField>

        <Field>
          <Button :disabled="isSubmitting || !meta.touched" type="submit"
            >Delete Project</Button
          >
        </Field>
      </FieldGroup>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Lock } from 'lucide-vue-next'
import { Field as VeeField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'

const { projectId } = defineProps<{ projectId: string }>()

const emit = defineEmits<{
  'delete-project': [id: string];
}>()

const deleteProjectSchema = z.object({
  password: z.string().trim(),
})

const { isSubmitting, handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(deleteProjectSchema),
  initialValues: {
    password: '',
  },
})

const handleDeleteProject = handleSubmit(async (data) => {
  try {
    await $fetch(`/api/project/${projectId}`, {
      method: 'DELETE',
      body: {
        password: data.password,
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Project deleted successfully!')
          emit('delete-project', projectId)
          return
        }
        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })
  } catch (error) {
    console.log('[DELETE_PROJECT_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
})
</script>

<style scoped></style>
