<template>
  <div class="w-full">
    <h1 class="text-2xl font-semibold text-color">
      Archivos compartidos conmigo
    </h1>
    <SharedFilesView class="py-2" role="employee"
    :subarchives="data.results.subarchives"
    @deleted="() => {
      console.log('refreshing');
      refresh();
      }
      "
    :current-directory="shared_directory._id" empty-message="No se han
    compartido archivos con tu usuario" />
  </div>
</template>
<script setup>
  import SharedFilesView from "~/components/SharedFilesView.vue";

  const { session } = storeToRefs(useSessionStore());
  const { shared_directory } = session.value;

  const { data, refresh } = await useAsyncData(() =>
    $api(`/directories/${shared_directory._id}`),
  );

  definePageMeta({
    layout: "employee",
  });
</script>
<style lang="postcss" scoped></style>
