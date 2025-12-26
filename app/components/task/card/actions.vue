<template>
  <Dialog>
    <DropdownMenu data-not-draggable>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost">
          <EllipsisVertical class="size-[20px]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <!-- DIALOG_TRIGGER -->
          <DialogTrigger as-child >
            <DropdownMenuItem>
              Go to Task
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem> Edit Project </DropdownMenuItem>

          <DropdownMenuItem
            class="text-red-500 hover:text-red-700 focus:text-red-700"
          >
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <DialogContent>
      <div>
        <TaskDetailsContent
          :task-details="task"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import type { Task } from '~~/server/types'
defineProps<{
  task: Task
}>()

</script>

<style scoped></style>
