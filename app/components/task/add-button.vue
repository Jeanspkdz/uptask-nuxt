<template>
  <Dialog v-slot="{close}">
    <DialogTrigger as-child>
      <Button variant="primaryAlt" class="px-6"> Add Task </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogTitle class="text-2xl font-black">New Task</DialogTitle>
      <DialogDescription class="font-extrabold text-black -mt-3">
        Fill out the form and create
        <span class="text-fuchsia-600">a new task</span>
      </DialogDescription>

      <form id="add-task" class="space-y-6" @submit.prevent="handleAddNewTask(close)()">
        <FormField v-slot="{componentField}" name="name">
          <FormItem>
            <FormLabel>Name Task</FormLabel>
            <FormControl>
              <Input placeholder="Your task name" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

         <FormField v-slot="{componentField }" name="description">
          <FormItem>
            <FormLabel>Description Task</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter the task description"  rows="3" class="field-sizing-fixed resize-none " v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </form>

      <DialogFooter>
        <Button class="w-full" form="add-task" :disabled="isSubmitting || !isInputValid"> Create </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'

import type { ErrorData } from '~~/server/errors'
import type { Task } from '~~/server/types'

const emit = defineEmits<{
  taskCreated: [task: Task]
}>()

const route = useRoute()
const projectId = route.params.id

const addTaskSchema = z.object({
  name: z.string().trim().min(1, { error: 'A task name is required.' }),
  description: z.string().trim().min(1, { error: 'A description is required.' })
})

const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema: toTypedSchema(addTaskSchema),
  initialValues: {
    description: '',
    name: ''
  }
})
const isInputValid = computed(() => meta.value.valid)

const handleAddNewTask = (closeDialog: () => void) => {
  return handleSubmit(async (data, actions) => {
    try {
      await $fetch(`/api/project/${projectId}/task`, {
        method: 'POST',
        body: {
          ...data
        },
        ignoreResponseError: true,
        onResponse ({ response }) {
          if (response.ok) {
            toast.success('Task Created Successfully!!')
            actions.resetForm()
            closeDialog()
            emit('taskCreated', response._data)
            return
          }
          const errorData = response._data.data as ErrorData
          toast.error(getErrorMessage(errorData.scope, errorData.code))
        }
      })
    } catch {
      toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
    }
  })
}

</script>

<style scoped></style>
