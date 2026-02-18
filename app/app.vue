<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster
      rich-colors
      :close-button='true'
      close-button-position="top-right"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

const nuxtPayload = useNuxtApp()
watchEffect(() => {
  console.log(nuxtPayload.payload)
})
</script>
