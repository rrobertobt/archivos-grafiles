<template>
  <div class="w-full">
    <h1 class="text-2xl font-semibold text-color pb-2">Visualización de archivo</h1>
    <h2 class="text-lg font-mono font-semibold text-muted-color-emphasis">{{ data.file.name }}</h2>
    <!-- {{ data.file.mime_type }} -->
      <figure class="w-full">
        <img :src="data.content" alt="Imagen de archivo" class="w-full" />
      </figure>
  </div>
</template>
<script setup>
const route = useRoute();
  const { data } = await useAsyncData(() =>
    $api(`/files/${route.params.fileId}`)
  );


  definePageMeta({
    layout: "employee",
  });
</script>
<style scoped></style>
