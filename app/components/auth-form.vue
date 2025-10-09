<template>
  <div class="px-4">
    <header class="text-white mb-6">
      <h1 class="font-extrabold text-2xl md:text-4xl">Log In</h1>
      <h3 class="font-medium mt-4 text-lg md:text-2xl">
        Make your ideas
        <span class="text-fuchsia-500 font-bold">happen</span>
      </h3>
    </header>

    <div class="mx-auto bg-white px-6 py-7 w-full md:max-w-10/12">
      <form class="space-y-6"  @submit.prevent="handleLogin">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel class="block mb-3 font-medium text-lg">Email </FormLabel>

            <FormControl>
              <Input
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
          type="submit"
          class="bg-fuchsia-600 hover:bg-fuchsia-700 focus-visible:ring-2 focus-visible:ring-fuchsia-900 focus-visible:outline-hidden cursor-pointer transition-colors w-full"
        >
          Log In
        </Button>
      </form>
    </div>

    <footer class="mt-6">
      <div class="text-sm text-slate-300 text-center space-y-2">
        <p class="block hover:underline">Don't have an account ? Create one</p>
        <p class="block hover:underline">Forgot your passowrd? Reset it</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email({ error: 'Email is required' }),
  password: z.string({ error: 'Password is required' }),
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const handleLogin = handleSubmit(data => {
  console.log(data)
})

</script>

<style scoped></style>
