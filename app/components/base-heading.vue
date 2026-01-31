<template>
  <div>
    <h1 class="text-4xl font-black">{{ props.title }}</h1>
    <h3 class="text-xl text-slate-500 font-semibold mt-2">
       {{ props.subtitle }}
    </h3>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string,
  subtitle: string
}>()
</script>

<style scoped></style>
