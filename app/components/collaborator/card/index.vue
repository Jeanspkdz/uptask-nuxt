<template>
   <article
    class="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
  >
    <div class="flex items-center space-x-4">
      <img
        v-if="collaborator.image"
        :src="collaborator.image"
        alt="Avatar"
        class="w-12 h-12 rounded-full object-cover"
      >
      <div v-else class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
        {{ collaborator.name.charAt(0).toUpperCase() }}
      </div>

      <div class="flex flex-col">
        <span class="font-medium text-gray-900">{{ collaborator.name }}</span>
        <span class="text-sm text-gray-500">{{ collaborator.email }}</span>
      </div>
    </div>

    <div>
      ACTIONS
    </div>
  </article>
</template>

<script setup lang="ts">

defineProps<{
  collaborator: {
    name: string
    email: string
    image: string | null
  }
}>()
</script>

<style scoped>

</style>
