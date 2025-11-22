<template>
  <DropdownMenu data-not-draggable>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="">
        <EllipsisVertical class="size-[20px]"/>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
           Go to Task
        </DropdownMenuItem>

        <DropdownMenuItem>
          Edit Project
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
</script>

<style scoped></style>
