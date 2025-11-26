<template>
  <ClientOnly>
     <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost">
            <EllipsisVertical class="text-zinc-400 size-[20px]" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" :align-offset="50" side="left" loop>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <NuxtLink
                :to="`project/${projectId}`"
              >
                Go to project
              </NuxtLink>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <NuxtLink :to="`project/${projectId}/update`">
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
  </ClientOnly>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import type { Project } from '~~/server/types'

defineProps<{ projectId: Project['id'] }>()

</script>

<style scoped>

</style>
