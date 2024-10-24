<template>
  <div class="w-full" v-if="folderData">
    <FilesBreadcrum role="admin" :display_path="display_path" />
    <FilesView role="admin" :subarchives="folderData.subarchives" />
  </div>
</template>
<script setup>
import FilesView from '~/components/FilesView.vue';

  const route = useRoute();

  const {
    data: {
      value: { results: folderData, display_path },
    },
  } = await useAsyncData(() => {
    return $api(`/directories/${route.params.folderId}`);
  });

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
