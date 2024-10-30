<template>
  <Button :as="NuxtLink" :to="backRoute" text v-if="!data?.file">
    <Icon name="lucide:arrow-left" />
  </Button>
  <Message
    v-show="!data?.file"
    severity="error"
    icon="pi pi-exclamation-triangle"
    class="w-full h-min"
  >
    No se encontró el archivo
  </Message>
  <div class="w-full min-h-full" v-if="data?.file">
    <header>
      <span
        class="text-2xl font-semibold text-color flex md:iems-center flex-col pb-1"
      >
        <span class="flex items-center">
          <Button :as="NuxtLink" :to="backRoute" class="mr-4" text>
            <Icon name="lucide:arrow-left" />
          </Button>
          Visualización de archivo
        </span>
      </span>
      <div class="flex items-center justify-between">
        <span
          class="font-mono text-muted-color-emphasis inline-flex items-center py-3"
        >
          <Icon name="lucide:file-text" class="mr-2" />
          {{ data.file.name }}
        </span>
        <Button
          text
          size="small"
          @click="handleSaveChanges"
          :disabled="status === 'pending'"
        >
          <Icon name="lucide:save" />
          Guardar cambios
        </Button>
      </div>
    </header>
    <Divider class="!mb-2" />
    <figure
      class="flex items-center w-full md:w-5/12 justify-center"
      v-if="data.file.mime_type.includes('image')"
    >
      <img :src="data.content" alt="file" class="w-full" />
    </figure>
    <div class="w-full flex-col md:flex-row flex gap-2">
      <div
        class="md:w-1/2 w-full"
        :class="{
          '!w-full': data.file.mime_type.includes('plain'),
        }"
      >
        <div class="flex flex-col gap-y-2 size-full">
          <h6
          class="text-base font-semibold text-color"
           v-if="data.file.mime_type.includes('html')"
        >
          Contenido
        </h6>
          <Textarea
            v-if="data.file.mime_type.includes('text')"
            v-model="data.content"
            autoResize
            rows="20"
            cols="30"
            class="block md:hidden w-full"
          />
          <ClientOnly>
            <VueMonacoEditor
              v-if="data.file.mime_type.includes('text')"
              v-model:value="data.content"
              :theme="isDark ? 'vs-dark' : 'vs'"
              :language="editorLanguage"
              className="ring-2 hidden md:block h-[35rem] w-full ring-primary-emphasis-alt/10 px-1.5 rounded-lg"
              :options="{
                formatOnType: true,
                formatOnPaste: true,
                fontFamily: 'Geist Mono, ui-monospace',
                fontSize: 15,
              }"
            >
              {{ "Cargando editor..." }}
            </VueMonacoEditor>
          </ClientOnly>
        </div>
      </div>
      <div class="flex flex-col gap-y-2 h-full w-full md:w-1/2" v-if="data.file.mime_type.includes('html')">
        <h6
          class="text-base font-semibold text-color"
        >
          Prevista
        </h6>
        <iframe
          :srcdoc="data.content"
          v-if="data.file.mime_type.includes('html')"
          class="h-[35rem] ring-2 ring-primary-emphasis-alt/10 px-1.5 rounded-lg"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { NuxtLink } from "#components";
  import { VueMonacoEditor } from "@guolao/vue-monaco-editor";
  const { session } = useSessionStore();
  const { updatePlainContent } = useFilesStore();

  const route = useRoute();
  const { data, refresh, status } = await useAsyncData(() =>
    $api(`/files/${route.params.fileId}`),
  );
  const backRoute = computed(() => {
    if (
      session.root_directory._id === data.value?.file?.parent_directory ||
      !data.value
    ) {
      return "/admin/files";
    }
    return `/admin/files/folder/${data.value?.file?.parent_directory}`;
  });

  const handleSaveChanges = async () => {
    const repsonse = await updatePlainContent({
      fileId: data.value.file._id,
      newContent: data.value.content,
    });
    if (repsonse) {
      refresh();
    }
  };

  // editor setup
  const isDark = usePreferredDark();
  const editorLanguage = computed(() => {
    const mime = data.value.file?.mime_type;
    if (mime.includes("html")) return "html";
    return "";
  });

  definePageMeta({
    layout: "employee",
  });
</script>
<style scoped></style>
