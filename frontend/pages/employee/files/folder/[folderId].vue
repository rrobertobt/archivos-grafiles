<template>
  <div class="w-full" v-if="data.results">
    <div class="flex gap-x-2">
      <FolderDialog :parent-directory-id="route.params.folderId" @saved="refresh"/>
      <FileUploadDialog :parent-directory-id="route.params.folderId" @saved="refresh"/>
    </div>
    <FilesBreadcrum role="employee" :display-path="data.display_path" />
    <FilesView role="employee" :subarchives="data.results.subarchives" @deleted="refresh" :current-directory="route.params.folderId"/>
  </div>
</template>
<script setup>
import FileUploadDialog from '~/components/FileUploadDialog.vue';

  const route = useRoute();

  const {
    data,
    refresh
  } = await useAsyncData(() => {
    return $api(`/directories/${route.params.folderId}`);
  });

  definePageMeta({
    layout: "employee",
  });

</script>
<style scoped></style>
