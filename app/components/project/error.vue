<template>
   <div class="grid h-full place-content-center text-center">
      <div v-if="errorStatusCode === 404">
        <h1 class="text-4xl font-black text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-gray-600 text-lg mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Button @click="$router.push('/')"> Back to Home </Button>
      </div>
       <div v-else-if="errorStatusCode === 400">
        <h1 class="text-4xl font-black  mb-4">Invalid Project ID</h1>
        <p class="text-gray-600 text-lg mb-8">
          Please check the project URL and try again.
        </p>
        <Button @click="$router.push('/')">View All Projects</Button>
      </div>
      <div v-else>
        <h1 class="text-4xl font-black text-gray-900 mb-4">Something Went Wrong</h1>
        <p class="text-gray-600 text-lg mb-8">
          Please try again later.
        </p>
        <Button @click="$router.push('/')">Back to Home</Button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getGenericErrorMessage, type GenericErrorKey } from '~/errors'

const { errorCode } = defineProps<{
  errorStatusCode: number
  errorCode: GenericErrorKey
}>()

onMounted(() => {
  toast.error(getGenericErrorMessage(errorCode))
})

</script>

<style scoped>

</style>
