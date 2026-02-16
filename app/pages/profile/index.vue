<template>
  <div class="w-10/12 mx-auto min-h-full">
    <Tabs class="min-h-full" default-value="account">
      <TabsList class="mb-6">
        <TabsTrigger value="account" class="text-lg"> My Account </TabsTrigger>
        <TabsTrigger value="change-password" class="text-lg"> Change Password </TabsTrigger>
      </TabsList>
      <TabsContent value="account" class="mx-auto w-7/12">
        <BaseHeading
          title="My Profile"
          subtitle="Update your user information"
          class="mb-5"
        />
        <ProfileFormUserInfo class="w-full" />
      </TabsContent>
      <TabsContent value="change-password" class="mx-auto w-7/12">
        <BaseHeading
          title="Change Password"
          subtitle="Update your password by filling out this form"
          class="mb-5"
        />
        <ProfileFormChangePassword/>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'home-layout',
})
</script>

<style scoped></style>
