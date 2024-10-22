<template>
  <div>
    is:{{ $route.params }}
      <Button as="router-link" to="/employee/files" label="Ir a /" />
      <Button as="router-link" to="/employee/files/1" label="Ir a 1" />
      <Button as="router-link" to="/employee/files/undirectorio/otrodir/" label="Ir a anidado" />
    <NuxtPage
    :at-root="!$route.params.path"
    />
  </div>
</template>
<script setup>

  definePageMeta({
    layout: "employee",
  });
</script>
<style lang="postcss" scoped></style>
