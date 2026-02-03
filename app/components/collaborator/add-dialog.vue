<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="primaryAlt">Add Collaborator</Button>
    </DialogTrigger>
    <DialogContent
      @close-auto-focus="handleCloseAutoFocus"
    >
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold"
          >Add a new member to the team</DialogTitle
        >
        <DialogDescription class="text-lg font-semibold text-black">
          Search for a new member to
          <span class="text-fuchsia-600">add them to the project</span>
        </DialogDescription>
      </DialogHeader>

      <div class="mt-3">
        <form>
          <VeeField
            v-slot="{ field }"
            name="email"
            @update:model-value="searchForCollaboratorsDebounced"
          >
            <Field>
              <FieldLabel class="text-lg">User Email</FieldLabel>

              <InputGroup>
                <InputGroupInput placeholder="user@correo.com" v-bind="field" />
                <InputGroupAddon align="inline-end">
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </VeeField>
        </form>
      </div>

      <CollaboratorSearchResult v-if="foundUsers" :found-users="foundUsers" />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Search } from 'lucide-vue-next'
import { Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'
import type { User } from '~~/server/types'

const foundUsers = ref<User[] | null>(null)

const handleSearchResult = (users: User[]) => {
  foundUsers.value = [...users]
}

const handleCloseAutoFocus = () => {
  foundUsers.value = null
}

const searchForCollaborators = async (input: string) => {
  try {
    await $fetch('/api/user', {
      method: 'GET',
      query: {
        email: input,
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          console.log(response)
          handleSearchResult(response._data)
          return
        }
        console.log('ERROR', response)

        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })
  } catch (error) {
    console.log('[SEARCH_FOR_USERS_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  }
}

const searchForCollaboratorsDebounced = useDebounceFn(
  searchForCollaborators,
  1000
)
</script>

<style scoped></style>
