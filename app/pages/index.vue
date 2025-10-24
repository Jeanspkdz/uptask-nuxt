<template>
  <div class="max-w-10/12 mx-auto">
    <BaseHeading
      title="My Projects"
      subtitle="Control and manage your projects"
    />
    <Button
      as-child
      variant="soft"
      class="mt-3"
    >
      <NuxtLink to="/project/create"> Add new project </NuxtLink>
    </Button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home-layout',
})
</script>

<style scoped></style>
