<template>
  <div class="flex flex-col w-full gap-y-2" v-if="!data?.file">
    <Button :as="NuxtLink" :to="backRoute" text label="Regresar">
      <template #icon>
        <Icon name="lucide:arrow-left" />
      </template>
    </Button>
    <Message
      severity="error"
      icon="pi pi-exclamation-triangle"
      class="w-full h-min"
    >
      No se encontró el archivo
    </Message>
  </div>
  <FileDetailView readonly :data :status @update="refresh" :backRoute />
</template>
<script setup>
  import { NuxtLink } from "#components";
  import FileDetailView from "~/components/FileDetailView.vue";

  const { session } = useSessionStore();
  const backRoute = computed(() => {
    if (
      route.path.includes("shared")
    ) return "/admin/shared";
    if (
      session.root_directory._id === data.value?.file?.parent_directory ||
      !data.value
    ) {
      return "/admin/files";
    }
    return `/admin/files/folder/${data.value?.file?.parent_directory}`;
  });

  const route = useRoute();
  const { data, refresh, status } = await useAsyncData(() =>
    $api(`/files/${route.params.fileId}`),
  );

  definePageMeta({
    layout: "admin",
  });
</script>
<style scoped></style>
