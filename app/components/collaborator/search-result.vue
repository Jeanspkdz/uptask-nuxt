<template>
  <div>
    <p v-if="foundUsers.length === 0" class="italic text-center font-semibold">
      No Users Found
    </p>
    <div v-else class="mt-3">
      <h3 class="font-semibold text-center">Results:</h3>
      <ul>
        <li v-for="user in foundUsers" :key="user.id" class="">
          <div class="space-y-2">
            <CollaboratorSearchListItem
              :user-email="user.email"
              :user-id="user.id"
            />
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
