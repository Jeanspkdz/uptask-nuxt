<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button class="hover:cursor-pointer bg-violet-400 p-1">
        <Menu class="text-white" width="16" height="16" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="end" :loop="true">
      <DropdownMenuLabel>Hello {{ authStore.user?.name }}</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem as-child>
          <NuxtLink to="/profile">
            <UserRoundPen />
            Profile
          </NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <NuxtLink to="/">
            <FolderDot />
            My Projects
          </NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem @select="handleLogOut">
          <logOut />
          Log Out</DropdownMenuItem
        >
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Menu, UserRoundPen, FolderDot, LogOut } from 'lucide-vue-next'
import { authClient } from '~/lib/auth'

const authStore = useAuthStore()
await callOnce(authStore.getUserSession)

const handleLogOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: async () => {
        await navigateTo('/auth/sign-in')
      },
    },
  })
}
</script>

<style scoped></style>
