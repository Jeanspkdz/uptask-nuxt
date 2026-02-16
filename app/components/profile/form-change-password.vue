<template>
  <div class="bg-white shadow-md px-5 py-6 max-w-11/12 w-full">
    <form @submit="handleChangePassword">
      <FieldSet>
        <VeeField v-slot="{ field, errors }" name="current-password">
          <Field>
            <FieldLabel>Current Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <KeyRound />
              </InputGroupAddon>
              <InputGroupInput
                v-bind="field"
                type="password"
                autocomplete="current-password"
              />
            </InputGroup>
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field , errors}" name="new-password">
          <Field>
            <FieldLabel>New Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Shield />
              </InputGroupAddon>
              <InputGroupInput
                type="password"
                autocomplete="new-password"
                v-bind="field"
              />
            </InputGroup>
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="confirm-new-password">
          <Field>
            <FieldLabel>Repeat New Password</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <ShieldCheck />
              </InputGroupAddon>
              <InputGroupInput
                type="password"
                autocomplete="new-password"
                v-bind="field"
              />
            </InputGroup>
          </Field>
          <FieldError v-if="errors.length" :errors="errors" />
        </VeeField>
      </FieldSet>

      <Field class="mt-5 w-full">
        <Button :disabled="isSubmitting || !meta.valid">Change Password</Button>
      </Field>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Shield, KeyRound, ShieldCheck } from 'lucide-vue-next'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'
import { authClient } from '~/lib/auth'

const changePasswordSchema = z
  .object({
    'current-password': z
      .string()
      .min(6, { message: 'Current password is required' })
      .trim(),

    'new-password': z
      .string()
      .min(8, { message: 'New password must be at least 8 characters' })
      .trim(),

    'confirm-new-password': z
      .string()
      .min(8, { message: 'Please confirm your new password' })
      .trim(),
  })
  .refine((data) => data['new-password'] === data['confirm-new-password'], {
    when (payload) {
      return payload.issues.every((iss) => {
        const firstPathEl = iss.path?.[0]
        return (
          firstPathEl !== 'new-password' &&
          firstPathEl !== 'confirm-new-password'
        )
      })
    },
    message: 'Passwords do not match',
    path: ['confirm-new-password'],
  })

const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema),
  initialValues: {
    'confirm-new-password': '',
    'current-password': '',
    'new-password': '',
  },
})

const handleChangePassword = handleSubmit(async (values, actions) => {
  try {
    await authClient.changePassword({
      currentPassword: values['current-password'],
      newPassword: values['new-password']
    }, {
      onError (ctx) {
        toast.error(getErrorMessage('AUTH', ctx.error.code))
      },
      onSuccess () {
        toast.success('Password Updated Sucessfully!!!')
        actions.resetForm()
      }
    })
  } catch (error) {
    console.log('[CHANGE_PASSWORD_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
})
</script>

<style scoped></style>
