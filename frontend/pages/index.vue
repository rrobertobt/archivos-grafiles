<template>
  <div class="w-full h-screen">
    <div class="h-full flex flex-col items-center justify-center gap-4">
      <h2 class="text-3xl flex items-center gap-4 justify-center">
        <Icon name="lucide:folder-check" size="2rem" />
        <span class="font-semibold"> Bienvenido a GraFiles </span>
      </h2>
      <Button :as="NuxtLink" to="/login">
        <Icon name="lucide:log-in" />
        {{ session ? "Ingresar" : "Iniciar sesión" }}
      </Button>
    </div>
  </div>
</template>
<script setup>
  import { NuxtLink } from "#components";

  const { session, role } = storeToRefs(useSessionStore());
</script>
<style scoped></style>
