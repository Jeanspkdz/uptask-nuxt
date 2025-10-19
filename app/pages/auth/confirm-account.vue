<template>
  <div class="w-full">
    <div class="space-y-4">
      <h2 class="text-2xl md:text-4xl text-white font-bold">
        Confirm your <br >
        Account
      </h2>
      <p class="text-base md:text-lg text-white/80 font-semibold">
        Enter the code you received <span class="text-fuchsia-600 "> by email </span>
      </p>
    </div>

    <div class="shadow-md bg-white p-4 md:p-8  mt-5  md:mt-10 flex flex-col items-center ">
      <h4 class="text-center mb-4 text-base md:text-2xl font-semibold">6 Digit Code</h4>

      <PinInput v-model="otpCode" placeholder="0" @complete="handleOnComplete">
        <PinInputGroup>
          <PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" />
        </PinInputGroup>
      </PinInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth'

const route = useRoute()
const userEmail = route.query.email?.toString() ?? ''

definePageMeta({
  layout: 'auth-layout',
})

const handleOnComplete = async () => {
  const rawOtp = otpCode.value.join('')
  console.log(rawOtp)
  console.log(userEmail)

  const result = await authClient.emailOtp.verifyEmail({
    otp: rawOtp,
    email: userEmail
  })
  console.log('ON_COMPLETE', result)
}

const otpCode = ref<string[]>([])
</script>

<style scoped></style>
