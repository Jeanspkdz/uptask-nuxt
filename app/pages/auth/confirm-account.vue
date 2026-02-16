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

      <PinInput v-model="otpCode" placeholder="0" :disabled="isLoading" @complete="handleOnComplete">
        <PinInputGroup>
          <PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" class="focus:ring-fuchsia-500/70"/>
        </PinInputGroup>
      </PinInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'
import { getAuthErrorMessage } from '~/errors/auth'
import { authClient } from '~/lib/auth'

definePageMeta({
  layout: 'auth-layout',
})

const route = useRoute()
const userEmail = route.query.email?.toString() ?? ''

const otpCode = ref<string[]>([])
const isLoading = ref(false)

const handleOnComplete = async () => {
  try {
    isLoading.value = true
    const rawOtp = otpCode.value.join('')

    const { error } = await authClient.emailOtp.verifyEmail({
      otp: rawOtp,
      email: userEmail,
    })

    if (error) {
      console.log('ERR_CODE', error.code)
      const errorMessage = getAuthErrorMessage(error.code ?? '')
      toast.error(errorMessage, {
        position: 'top-right'
      })
      return
    }

    toast.success('Verification successful!')
    return await navigateTo('/auth/sign-in')
  } catch {
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped></style>
