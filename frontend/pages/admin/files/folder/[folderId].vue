<template>
  <div class="w-full" v-if="data.results">
    <div class="flex gap-x-2">
      <FolderDialog :parent-directory-id="route.params.folderId" @saved="refresh"/>
      <FileUploadDialog :parent-directory-id="route.params.folderId" @saved="refresh"/>
    </div>
    <FilesBreadcrum role="admin" :display-path="data.display_path" />
    <FilesView role="admin" :subarchives="data.results.subarchives" @deleted="refresh" :current-directory="route.params.folderId" />
  </div>
</template>
<script setup>
import FilesView from '~/components/FilesView.vue';

  const route = useRoute();

  const {
    data,
    refresh
  } = await useAsyncData(() => {
    return $api(`/directories/${route.params.folderId}`);
  });

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
