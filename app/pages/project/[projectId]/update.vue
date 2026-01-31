<template>
  <section class="max-w-10/12 mx-auto min-h-full my-auto">
    <ProjectError
      v-if="error"
      :error-code="error.statusMessage as GenericErrorKey ?? 'UNKNOWN'"
      :error-status-code="error.statusCode ?? 400"
    />

    <div v-else>
      <BaseHeading
        title="Edit Project"
        subtitle="Edit your project details below"
      />

      <Button as-child variant="primaryAlt" class="mt-3">
        <NuxtLink to="/"> Go Back to Projects </NuxtLink>
      </Button>

      <form
        class="mt-6 bg-white p-6 space-y-4 shadow-md rounded-md max-w-full min-w-[370px]"
        @submit="handleUpdateProject"
      >
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel class="uppercase font-black text-base">
              Project Name
            </FormLabel>

            <FormControl>
              <Input placeholder="Project title" v-bind="componentField" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="clientName">
          <FormItem>
            <FormLabel class="uppercase font-black text-base"
              >Client Name</FormLabel
            >
            <FormControl>
              <Input
                placeholder="Input the client name"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel class="uppercase font-black text-base">
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter the description"
                v-bind="componentField"
                rows="3"
                class="field-sizing-content resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button
          :disabled="isSubmitting || !meta.dirty"
          type="submit"
          class="uppercase w-full"
        >
          Update Project
        </Button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import FormItem from '~/components/ui/form/FormItem.vue'
import {
  getErrorMessage,
  type GenericErrorKey
} from '~/errors'
import type { ErrorData } from '~~/server/errors'
import type { Project } from '~~/server/types'

definePageMeta({
  layout: 'home-layout',
})
const route = useRoute()
const projectId = route.params.projectId

const { data, error } = await useFetch<Project>(`/api/project/${projectId}`)

const updateProjectSchema = z.object({
  name: z
    .string({ error: 'Project name is required' })
    .min(4, { error: 'Project name must be at least 4 characters long' }),
  clientName: z
    .string({ error: 'Client name is required' })
    .min(4, { error: 'Client name must be at least 4 characters long' }),
  description: z
    .string({ error: 'Description is required' })
    .min(10, { error: 'Description must be at least 10 characters long' }),
})

const { isSubmitting, handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(updateProjectSchema),
  initialValues: {
    clientName: data.value?.clientName,
    description: data.value?.description,
    name: data.value?.name,
  },
})

const handleUpdateProject = handleSubmit(async (values, actions) => {
  try {
    await $fetch(`/api/project/${projectId}`, {
      method: 'PUT',
      body: {
        ...values,
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Project updated successfully!!')
          actions.resetForm({
            values,
          })
          return
        }
        const errorData = response._data.data as ErrorData
        toast.error(getErrorMessage(errorData.scope, errorData.code))
      },
    })
  } catch (error) {
    console.log('ERR_UPDATE_PROJECT', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
})

</script>

<style scoped></style>
