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
          <DialogTrigger as-child>
            <DropdownMenuItem
              @select="
                () => {
                  console.log('Hicsite click');
                }
              "
            >
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
        <!-- <component :is="currentModal['detailModal']" /> -->
        <TaskModalDetail :task-details="task" />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import type { Task } from '~~/server/types'
import { TaskModalDetail } from '#components'

const props = defineProps<{
  task: Task;
}>()

const currentModal = {
  detailModal: TaskModalDetail,
  // editModal :
} as const

watchEffect(() => {
  console.log('PROPS-ACTIONS', props.task)
})
</script>

<style scoped></style>
