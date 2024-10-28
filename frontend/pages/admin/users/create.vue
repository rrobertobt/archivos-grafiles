<template>
  <div class="!w-full">
    <h4 class="text-xl my-2 font-semibold text-muted-color-emphasis">
      Crear trabajador
    </h4>
    <Button class="my-4" :as="NuxtLink" to="/admin/users">
      <Icon name="lucide:arrow-left" />
      Cancelar
    </Button>
    <form class="grid gap-4 grid-cols-1 md:grid-cols-4" @submit.prevent="handleSaveUser">
      <FloatLabel variant="in" class="w-full">
        <IconField>
          <InputIcon>
            <Icon name="lucide:square-user" />
          </InputIcon>
          <InputText
            fluid
            id="username"
            v-keyfilter.alphanum
            v-model="userData.username"
            variant="filled"
          />
        </IconField>
        <label for="username">Nombre de usuario</label>
      </FloatLabel>

      <FloatLabel variant="in" class="w-full">
        <IconField>
          <InputIcon>
            <Icon name="lucide:book-user" />
          </InputIcon>
          <InputText
            fluid
            id="name"
            v-model="userData.name"
            variant="filled"
          />
        </IconField>
        <label for="name">Nombre personal</label>
      </FloatLabel>

      <FloatLabel variant="in" class="w-full">
        <IconField>
          <InputIcon>
            <Icon name="lucide:key-square" />
          </InputIcon>
          <InputText
            fluid
            id="password"
            v-model="userData.password"
            variant="filled"
            type="password"
          />
        </IconField>
        <label for="password">Contraseña</label>
      </FloatLabel>

      <Button class="col-span-1 lg:col-span-2" 
      :disabled="!userData.username || !userData.name || !userData.password || !userData.role"
      type="submit">
        <Icon name="lucide:save" />
        Guardar usuario
      </Button>
    </form>
  </div>
</template>
<script setup>
  import { NuxtLink } from "#components";
  import { useAdminStore } from "~/stores/admin";

  const userData = ref({
    username: "",
    name: "",
    password: "",
  });

  const handleSaveUser = async () => {
    const response = await useAdminStore().createEmployee({
      ...userData.value,
      role: "employee",
    });
    if (!response.error) {
      navigateTo("/admin/users");
    }
  };

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
