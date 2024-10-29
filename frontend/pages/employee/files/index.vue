<template>
  <div class="w-full" v-if="data.results">
    <div class="flex gap-x-2">
      <FolderDialog :parent-directory-id="root_directory._id" @saved="refresh" />
      <FileUploadDialog :parent-directory-id="root_directory._id" @saved="refresh" />
    </div>
    <FilesBreadcrum role="employee" :display-path="data.display_path" />
    <FilesView role="employee" :subarchives="data.results.subarchives" @deleted="refresh" :current-directory="root_directory._id" />
  </div>
</template>
<script setup>
import FileUploadDialog from '~/components/FileUploadDialog.vue';
import FolderDialog from '~/components/FolderDialog.vue';

  const { session } = storeToRefs(useSessionStore());
  const { root_directory } = session.value;

  const {
    data,
    refresh
  } = await useAsyncData(() => $api(`/directories/${root_directory._id}`));

  definePageMeta({
    layout: "employee",
  });
</script>
<style scoped>
</style>
