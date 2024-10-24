<template>
  <div class="w-full">
    <h1 class="text-2xl mb-6 font-semibold text-color">Papelera</h1>
    <TrashView :subarchives="data.results"/>
  </div>
</template>
<script setup>
import TrashView from '~/components/TrashView.vue';

  const { data, refresh } = await useAsyncData(() =>
    $api("/directories/trash"),
  );

  definePageMeta({
    layout: "admin",
  });
</script>
<style lang="postcss" scoped></style>
