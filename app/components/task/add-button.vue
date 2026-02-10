<template>
  <Dialog v-slot="{close}">
    <DialogTrigger as-child>
      <Button variant="primaryAlt" class="px-6"> Add Task </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogTitle class="text-2xl font-bold">New Task</DialogTitle>
      <DialogDescription class="font-bold text-black -mt-3">
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

const emit = defineEmits<{
  taskCreated: [task: ProjectTask]
}>()

const route = useRoute()
const projectId = route.params.projectId

const addTaskSchema = z.object({
  name: z
    .string({ message: 'A task name is required.' })
    .trim()
    .min(4, { message: 'Task name must be at least 4 characters long.' }),
  description: z
    .string({ message: 'A description is required.' })
    .trim()
    .min(10, { message: 'Description must be at least 10 characters long.' })
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
            console.log(response)

            actions.resetForm()
            closeDialog()
            emit('taskCreated', response._data.insertedTask)
            return
          }
          const errorData = response._data.data
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
