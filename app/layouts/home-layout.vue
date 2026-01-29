<template>
  <div class="min-h-dvh flex flex-col">
    <header class="w-full max-w-dvw bg-slate-900">
      <div class="flex justify-between items-center mx-auto max-w-10/12 py-3">
        <NuxtImg src="/logo.svg" width="200" height="40" class="-ms-4 aspect-[285/100]" />
        <button class="hover:cursor-pointer bg-violet-400 p-1">
          <Menu class="text-white"  width="16" height="16"/>
        </button>
      </div>
    </header>
    <main class="py-7 bg-gray-100/80 flex-1 min-h-full flex">
      <slot/>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
const authStore = useAuthStore()
await callOnce(authStore.getUserSession)

</script>

<style scoped></style>
