<template>
  <div>
    <p v-if="foundUsers.length === 0" class="italic text-center font-semibold">
      No Users Found
    </p>
    <div v-else class="mt-3">
      <h3 class="font-semibold text-center">Results:</h3>
      <ul>
        <li v-for="user in foundUsers" :key="user.id" class="">
          <div class="flex justify-between space-y-2">
            <span>{{ user.email }}</span>
            <Button
              variant="ghost"
              class="bg-purple-200/75 text-purple-600 hover:bg-purple-300 hover:text-purple-600 hover:cursor-pointer transition-colors"
            >
              Add to project
            </Button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~~/server/types'

defineProps<{
  foundUsers: User[];
}>()
</script>

<style scoped></style>
