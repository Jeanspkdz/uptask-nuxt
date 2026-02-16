<template>
  <div :class="cn('bg-white shadow-md px-5 py-6')">
    <form @submit="handleUpdateUserInfo">
      <FieldSet>
        <VeeField v-slot="{ field }" name="userName">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <User2 />
              </InputGroupAddon>
              <InputGroupInput v-bind="field" />
            </InputGroup>
          </Field>
        </VeeField>
        <VeeField v-slot="{ field }" name="email">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupInput v-bind="field" />
            </InputGroup>
          </Field>
        </VeeField>
      </FieldSet>

      <Field class="mt-5 w-full">
        <Button :disabled="!meta.dirty || isSubmitting">Save Changes</Button>
      </Field>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Mail, User2 } from 'lucide-vue-next'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'
import { authClient } from '~/lib/auth'
import { cn } from '~/lib/utils'

const authStore = useAuthStore()

const updateUserInfoSchema = z.object({
  userName: z
    .string()
    .min(1, { message: 'Name is required.' })
    .min(4, { message: 'Name must be at least 4 characters long.' })
    .trim(),

  email: z.email({ message: 'Please enter a valid email address.' }).trim(),
})

const { handleSubmit, meta, isSubmitting } = useForm({
  validationSchema: toTypedSchema(updateUserInfoSchema),
  initialValues: {
    email: authStore.user?.email,
    userName: authStore.user?.name,
  },
})
const handleUpdateUserInfo = handleSubmit(
  async ({ userName, email }, actions) => {
    try {
      if (userName !== meta.value.initialValues?.userName) {
        await authClient.updateUser(
          {
            name: userName,
          },
          {
            onResponse ({ response }) {
              if (response.ok) {
                toast.success('Name updated successfully!!!')
                actions.resetForm({
                  values: { email, userName },
                })
                return
              }
              toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
            },
          }
        )
      }

      if (email !== meta.value.initialValues?.email) {
        await authClient.changeEmail(
          {
            newEmail: email,
            callbackURL: '/profile'
          },
          {
            onSuccess () {
              toast.success('Email updated succesfully!!!')
              actions.resetForm({
                values: { email, userName },
              })
            },
            onError (context) {
              toast.error(getErrorMessage('AUTH', context.error.code))
            },
          }
        )
      }
    } catch (error) {
      console.log('[UPDATE_USER_INFO_ERROR]', error)
      toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
    }
  }
)
</script>

<style scoped></style>
