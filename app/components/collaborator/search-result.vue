<template>
  <div>
    <p v-if="users.length === 0" class="italic text-center font-semibold">
      No Users Found
    </p>
    <div v-else class="mt-3">
      <h3 class="font-semibold text-center">Results:</h3>
      <ul class="space-y-3">
        <li v-for="user in users" :key="user.id" >
          <CollaboratorSearchListItem
            :user-email="user.email"
            :user-id="user.id"
            :is-added="user.isAdded"
            @collaborator-added="(collab) => $emit('collaborator-added', collab)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  users: Array<User & { isAdded: boolean }>;
}>()

defineEmits<{
  'collaborator-added': [collaborator: User]
}>()

</script>

<style scoped></style>
