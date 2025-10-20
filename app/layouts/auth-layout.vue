<template>
  <div class="max-w-dvw h-full min-h-dvh bg-[#1c2430] grid place-content-center py-6">
      <LogoApp class="mb-5 md:mb-8 justify-self-center"/>
      <div v-if="$slots.default" class="justify-self-center w-11/12 md:w-10/12 md:max-w-none">
        <slot  />
      </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
