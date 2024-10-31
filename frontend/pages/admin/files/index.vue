<template>
  <div class="w-full" v-if="data.results">
    <div class="flex gap-x-2">
      <FolderDialog :parent-directory-id="root_directory._id" @saved="refresh" />
      <FileUploadDialog :parent-directory-id="root_directory._id" @saved="refresh" />
      <FileDialog :parent-directory-id="root_directory._id" @saved="refresh" />
    </div>
    <FilesBreadcrum role="admin" :display-path="data.display_path" />
    <FilesView role="admin" :subarchives="data.results.subarchives" @deleted="refresh" :current-directory="root_directory._id" />
  </div>
</template>
<script setup>
import FilesBreadcrum from '~/components/FilesBreadcrum.vue';
import FilesView from '~/components/FilesView.vue';
import FileUploadDialog from '~/components/FileUploadDialog.vue';

  const { session } = storeToRefs(useSessionStore());
  const { root_directory } = session.value;

  const {
    data,
    refresh
  } = await useAsyncData(() => {
    return $api(`/directories/${root_directory._id}`);
  });

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
