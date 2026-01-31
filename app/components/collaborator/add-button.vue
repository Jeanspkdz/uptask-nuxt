<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="primaryAlt">Add Collaborator</Button>
    </DialogTrigger>
    <DialogContent>
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
          <VeeField name="email" v-slot="{ field }">
            <Field>
              <FieldLabel class="text-lg">User Email</FieldLabel>

              <InputGroup>
                <InputGroupInput
                  placeholder="user@correo.com"
                  v-bind="field"
                />
                <InputGroupAddon align="inline-end">
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </VeeField>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Field as VeeField } from "vee-validate";
</script>

<style scoped></style>
