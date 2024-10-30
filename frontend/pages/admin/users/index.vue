<template>
  <div class="!w-full">
    <h4 class="text-xl my-2 font-semibold text-muted-color-emphasis">
      Usuarios
    </h4>
    <Button
      class="!mb-4"
      :as="NuxtLink"
      to="/admin/users/create"
      label="Crear usuario"
    >
      <template #icon>
        <Icon name="lucide:user-plus" />
      </template>
    </Button>
    <DataTable :value="data.response" pt:tableContainer:class="shadow-md !rounded-lg" class="">
      <Column field="username" header="Nombre de usuario">
        <template #body="{ data }">
          <span class="flex items-center gap-2">
            <Icon name="lucide:scan-face" />
            {{ data.username }}
          </span>
        </template>
      </Column>
      <Column field="name" header="Nombre"></Column>
      <Column field="role" header="Rol">
        <template #body="{ data }">
          <span class="flex items-center gap-2">
            <Icon name="lucide:shield-check" />
            {{ data.role === "admin" ? "Administrador" : "Empleado" }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup>
  import { NuxtLink } from "#components";
  import { useAdminStore } from "~/stores/admin";

  const { getAllEmployees } = useAdminStore();

  const { data } = await useAsyncData(() => getAllEmployees());

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
