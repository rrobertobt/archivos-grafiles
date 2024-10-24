<template>
  <div class="w-full" v-if="folderData">
    <FilesBreadcrum role="admin" :display_path="display_path" />
    <FilesView role="admin" :subarchives="folderData.subarchives" />
  </div>
</template>
<script setup>
import FilesBreadcrum from '~/components/FilesBreadcrum.vue';
import FilesView from '~/components/FilesView.vue';

  const { session } = storeToRefs(useSessionStore());

  const {
    data: {
      value: { results: folderData, display_path },
    },
  } = await useAsyncData(() => {
    const { root_directory } = session.value;
    return $api(`/directories/${root_directory}`);
  });

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
