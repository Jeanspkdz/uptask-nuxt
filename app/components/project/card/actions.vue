<template>
  <Dialog>
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

          <DropdownMenuItem v-if="isOwnerProject" as-child>
            <NuxtLink :to="`/project/${projectId}/update`">
              Edit Project
            </NuxtLink>
          </DropdownMenuItem>

          <DialogTrigger as-child>
            <DropdownMenuItem
              v-if="isOwnerProject"
              class="text-red-500 hover:text-red-700 focus:text-red-700"
            >
              Delete Project
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <DialogContent>
      <ProjectModalDelete
        :project-id="projectId"
        @delete-project="(e) => {
          $emit('delete-project', e)
        }"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import type { UserRole } from './index.vue'

const props = defineProps<{ projectId: Project['id']; role: UserRole }>()
defineEmits<{
  'delete-project': [id: string];
}>()

const isOwnerProject = computed(() => props.role === 'manager')
</script>

<style scoped></style>
