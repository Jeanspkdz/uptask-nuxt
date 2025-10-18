<template>
  <div class="px-4">
    <header class="text-white mb-6">
      <slot name="header"/>
    </header>

    <div class="mx-auto bg-white px-6 py-7 w-full md:max-w-10/12">
      <slot/>
    </div>

    <footer class="mt-6">
      <slot name="footer"/>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
