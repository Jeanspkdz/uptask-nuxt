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
                Made task changes in
                <span class="text-fuchsia-600">this form</span>
              </FieldDescription>
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="name">
              <Field>
                <FieldLabel>Task Name</FieldLabel>
                <Input
                  placeholder="Your Task Name"
                  v-bind="field"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="description">
              <Field>
                <FieldLabel>Task Description</FieldLabel>
                <Textarea
                  placeholder="Your Task Description"
                  v-bind="field"
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
import { z } from 'zod'
const props = defineProps<{
  name: string;
  description: string;
}>()

const editTaskSchema = z.object({
  name: z.string().min(1, { error: 'A name is required' }),
  description: z
    .string()
    .min(8, { error: 'A description wiyth 8 length is required' }),
})

const { handleSubmit, meta, isSubmitting } = useForm({
  validationSchema: toTypedSchema(editTaskSchema),
  initialValues: {
    name: props.name,
    description: props.description,
  },
})

const handleEditTask = handleSubmit((values) => {
  console.log('EDIT TASK', values)
})
</script>

<style scoped></style>
