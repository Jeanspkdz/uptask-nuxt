<template>
  <Dialog>
    <DropdownMenu data-not-draggable>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" :class="$attrs.class">
          <EllipsisVertical class="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <!-- DIALOG_TRIGGER -->
          <DialogTrigger as-child>
            <DropdownMenuItem @select="changeCardModalType('detail')">
              Go to Task
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger v-if="userRole === 'manager'" as-child>
            <DropdownMenuItem @select="changeCardModalType('update')">
              Edit Task
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger v-if="userRole === 'manager'" as-child>
            <DropdownMenuItem
              class="text-red-500 hover:text-red-700 focus:text-red-700"
              @select="changeCardModalType('delete')"
            >
              Delete Task
            </DropdownMenuItem>
          </DialogTrigger>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <DialogContent>
      <div>
        <TaskModalDetail
          v-if="currentCardModalType == 'detail'"
          :task-details="task"
        />
        <TaskModalEdit
          v-else-if="currentCardModalType == 'update'"
          :task-id="task.id"
          :name="task.name"
          :description="task.description"
        />
        <div v-else>
          <TaskModalDelete
            :task-id="task.id"
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { TaskModalDetail, TaskModalEdit } from '#components'
import { EllipsisVertical } from 'lucide-vue-next'
import type { UserRole } from '~/components/project/card/index.vue'

defineOptions({
  inheritAttrs: false
})

defineProps<{
  task: ProjectTask;
  userRole: UserRole
}>()

type CardModalTypes = 'delete' | 'update' | 'detail'

const currentCardModalType = ref<CardModalTypes>('detail')

const changeCardModalType = (modalType: CardModalTypes) => {
  currentCardModalType.value = modalType
}

const app = useNuxtApp()
watchEffect(() => {
  console.log(app.payload)
})
</script>

<style scoped></style>
