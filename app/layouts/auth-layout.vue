<template>
  <div class="max-w-dvw h-full min-h-dvh bg-gray-900 grid place-content-center py-6">
      <LogoApp class="mb-5 md:mb-8"/>
      <div v-if="$slots.default" class="justify-self-center w-11/12 md:w-10/12 md:max-w-none">
        <slot  />
      </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
