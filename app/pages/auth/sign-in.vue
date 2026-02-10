<template>
  <div class="">
    <AuthForm>
      <template #header>
        <h1 class="font-extrabold text-2xl md:text-4xl">Log In</h1>
        <h3 class="font-medium mt-4 text-lg md:text-2xl">
          Make your ideas
          <span class="text-fuchsia-500 font-bold">happen</span>
        </h3>
      </template>

      <template #default>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="block mb-3 font-medium text-lg"
                >Email
              </FormLabel>

              <FormControl>
                <Input
                  autocomplete="email"
                  type="email"
                  placeholder="Enter your email"
                  v-bind="componentField"
                  class="block border px-2 py-2 w-full focus-visible:ring-fuchsia-500/70 selection:bg-fuchsia-900 selection:text-white"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="block mb-3 font-medium text-lg">
                Password
              </FormLabel>

              <FormControl>
                <Input
                  autocomplete="current-password"
                  type="password"
                  placeholder="Enter your password"
                  v-bind="componentField"
                  class="block border px-2 py-2 w-full focus-visible:ring-fuchsia-500/70 selection:bg-fuchsia-900 selection:text-white"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            :disabled="isSubmitting"
            type="submit"
            class=" w-full"
          >
            Log In
          </Button>
        </form>
      </template>

      <template #footer>
        <div class="text-sm text-slate-300 text-center space-y-2">
          <NuxtLink to="/auth/sign-up" class="block hover:underline">
            Don't have an account ? Create one
          </NuxtLink>
          <p class="block hover:underline">Forgot your passowrd? Reset it</p>
        </div>
      </template>
    </AuthForm>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { getErrorMessage } from '~/errors'
import { getAuthErrorMessage } from '~/errors/auth'
import { authClient } from '~/lib/auth'

definePageMeta({
  layout: 'auth-layout',
})

const loginSchema = z.object({
  email: z.email({ error: 'Email is required' }),
  password: z.string({ error: 'Password is required' }),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const handleLogin = handleSubmit(async data => {
  try {
    const { email, password } = data

    await authClient.signIn.email({
      email,
      password,
      rememberMe: false,
      fetchOptions: {
        onError (context) {
          console.log('ERROR_SING_IN', context)
          toast.error(getAuthErrorMessage(context.error.code))
        },
      },
      callbackURL: '/'
    })
  } catch (error) {
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
    console.log(error)
  }
})
</script>

<style scoped></style>
