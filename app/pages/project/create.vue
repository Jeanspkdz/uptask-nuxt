<template>
  <section class="px-4 max-w-[440px] mx-auto">
    <BaseHeading
      title="Create Project"
      subtitle="Fill out the following form to create a project"
    />
    <Button as-child variant="primaryAlt" class="mt-3">
      <NuxtLink to="/"> Go Back to Projects </NuxtLink>
    </Button>

    <form
      class="mt-6 bg-white p-6 space-y-4 shadow-md rounded-md"
      @submit="handleCreateProject"
    >
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel class="uppercase font-black text-base"
            >Project Name
          </FormLabel>
          <FormControl>
            <Input
              placeholder="Input your project name"
              v-bind="componentField"
            />
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

      <Button :disabled="isSubmitting" type="submit" class="uppercase w-full">
        Create Project
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'

definePageMeta({
  layout: 'home-layout',
})

const createProjectSchema = z.object({
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

const { isSubmitting, handleSubmit } = useForm({
  validationSchema: toTypedSchema(createProjectSchema),
  initialValues: {
    name: '',
    clientName: '',
    description: '',
  },
})

const handleCreateProject = handleSubmit(async (data, actions) => {
  try {
    await $fetch('/api/project', {
      ignoreResponseError: true,
      method: 'POST',
      body: data,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Project created successfully!')
          actions.resetForm()
          return
        }
        console.log('ERR_CREATE_PROJECT', response)

        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })
  } catch (error) {
    console.log('ERRR', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
})
</script>

<style scoped></style>
