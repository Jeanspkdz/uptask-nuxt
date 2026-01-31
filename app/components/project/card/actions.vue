<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost">
        <EllipsisVertical class="text-zinc-400 size-5" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" :align-offset="50" side="left" loop>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem as-child>
          <NuxtLink :to="`/project/${projectId}`"> Go to project </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuItem as-child>
          <NuxtLink :to="`/project/${projectId}/update`">
            Edit Project
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuItem
          class="text-red-500 hover:text-red-700 focus:text-red-700"
        >
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import type { Project } from '~~/server/types'

defineProps<{ projectId: Project['id'] }>()
</script>

<style scoped></style>
