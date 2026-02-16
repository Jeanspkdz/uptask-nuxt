<template>
  <div>
    <AuthForm>
      <template #header>
        <h1 class="font-extrabold text-2xl md:text-4xl">Sign Up</h1>
        <h3 class="font-medium mt-4 text-lg md:text-2xl">
          Start turning your ideas
          <span class="text-fuchsia-500 font-bold">into reality</span>
        </h3>
      </template>

      <template #default>
        <form class="space-y-6" @submit="handleSingUp">
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

          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel class="block mb-3 font-medium text-lg"
                >Username
              </FormLabel>

              <FormControl>
                <Input
                  autocomplete="username"
                  type="text"
                  placeholder="Enter your username"
                  v-bind="componentField"
                  class="block border px-2 py-2 w-full focus-visible:ring-fuchsia-500/70 selection:bg-fuchsia-900 selection:text-white"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="block mb-3 font-medium text-lg"
                >Password
              </FormLabel>

              <FormControl>
                <Input
                  autocomplete="new-password"
                  type="password"
                  placeholder="Enter your password"
                  v-bind="componentField"
                  class="block border px-2 py-2 w-full focus-visible:ring-fuchsia-500/70 selection:bg-fuchsia-900 selection:text-white"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel class="block mb-3 font-medium text-lg"
                >Repeat your Password
              </FormLabel>

              <FormControl>
                <Input
                  autocomplete="new-password"
                  type="password"
                  placeholder="Repeat your password"
                  v-bind="componentField"
                  class="block border px-2 py-2 w-full focus-visible:ring-fuchsia-500/70 selection:bg-fuchsia-900 selection:text-white"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>

          <Button :disabled="isSubmitting" type="submit" class="w-full">
            Register
          </Button>
        </form>
      </template>

      <template #footer>
        <div class="text-sm text-slate-300 text-center space-y-2">
          <NuxtLink to="/auth/sign-in" class="block hover:underline">
            Already have an account? Sign in
          </NuxtLink>
          <p class="block hover:underline">Forgot your password? Reset it</p>
        </div>
      </template>
    </AuthForm>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'
import { getErrorMessage } from '~/errors'
import { authClient } from '~/lib/auth'

definePageMeta({
  layout: 'auth-layout',
})

const signUpSchema = z
  .object({
    email: z.email({ error: 'Please enter a valid email' }),
    username: z.string({ error: 'Please enter a valid username' }),
    password: z
      .string({ error: 'Please enter a valid password' })
      .min(8, { error: 'The minimun length required is 8' }),
    confirmPassword: z.string({ error: 'Please repeat your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ['confirmPassword'],
    when (payload) {
      // return signUpSchema
      //   .pick({ password: true, confirmPassword: true })
      //   .safeParse(payload.value).success
      return payload.issues.every((iss) => {
        const firstPathEl = iss.path?.[0]
        return firstPathEl !== 'password' && firstPathEl !== 'confirmPassword'
      })
    },
  })

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(signUpSchema),
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
})

const handleSingUp = handleSubmit(async ({ email, username, password }, actions) => {
  await authClient.signUp.email(
    {
      email,
      password,
      name: username,
    },
    {
      onSuccess (context) {
        authClient.emailOtp.sendVerificationOtp({
          email: context.data.user.email,
          type: 'email-verification',
        })

        actions.resetForm()

        toast.success(
          'Sign-up successful! Please check your Gmail inbox to confirm your account.'
        )
      },
      onError (context) {
        console.log('OnError', context)
        toast.error(getErrorMessage('AUTH', context.error.code))
      },
    }
  )
})
</script>

<style scoped></style>
