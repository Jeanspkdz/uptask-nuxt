<template>
  <div class="mx-auto max-w-10/12 w-full">
    <BaseHeading
      title="Team Management"
      subtitle="Organize and oversee your project team"
    />

    <div class="flex gap-x-2 mt-5">
      <!-- <CollaboratorAddButton/> -->
      <Button variant="default" @click="$router.back">Go Back</Button>
    </div>

    <div>
      <h2>Current Members</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home-layout',
})

const { data } = await useFetch('/api/test')
watchEffect(() => {
  console.log('DATA', data.value)
})

</script>

<style scoped></style>
