<template>
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
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Search } from 'lucide-vue-next'
import { Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'

const emit = defineEmits<{
  'search-results': [collaborators: User[]]
}>()

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
          emit('search-results', response._data)
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
  300
)
</script>

<style scoped></style>
