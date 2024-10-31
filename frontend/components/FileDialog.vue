<template>
  <div class="mb-4">
    <Button label="Crear archivo" @click="visible = true" color="primary">
      <template #icon>
        <Icon name="lucide:file-plus" />
      </template>
    </Button>
    <Dialog
      v-model:visible="visible"
      modal
      header="Crear archivo"
      class="w-full lg:w-8/12"
      maximizable
      @hide="() => (fileData = { name: '', extension: '', content: '' })"
    >
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmitDirectory">
        <div class="flex gap-4">
          <!-- equal width for these 2 fields -->
          <FloatLabel variant="in" class="basis-0 grow">
            <InputText
              fluid
              :disabled="loading"
              v-model="fileData.name"
              id="folder-name"
              autocomplete="off"
              variant="filled"
              autofocus
            />
            <label for="folder-name">Nombre</label>
          </FloatLabel>
          <FloatLabel class="basis-0 grow" variant="in" >
            <Select
              v-model="fileData.extension"
              inputId="extension"
              :options="['txt', 'html']"
              fluid
              variant="filled"
            />
            <label for="extension">Extensión</label>
          </FloatLabel>
        </div>

        <h6 class="text-base font-semibold text-color">Contenido</h6>

        <Textarea
          v-model="fileData.content"
          autoResize
          rows="20"
          cols="30"
          class="block md:hidden w-full"
        />
        <ClientOnly>
          <VueMonacoEditor
            v-model:value="fileData.content"
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

        <Button type="submit" color="primary" :loading="loading" label="Crear" icon="pi pi-check" />
      </form>
    </Dialog>
  </div>
</template>
<script setup>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

  const filesStore = useFilesStore();
  const { createFileContent } = filesStore;
  const { loading } = storeToRefs(filesStore);

  const fileData = ref({
    name: "",
    extension: "",
    content: "",
  });

  const handleSubmitDirectory = async () => {
    const response = await createFileContent({
      folderId: parentDirectoryId,
      fileData: fileData.value,
    });
    if (!response.error) {
      visible.value = false;
      fileData.value = {
        name: "",
        extension: "",
        content: "",
      };
      emit("saved");
    }
  };

  const { parentDirectoryId } = defineProps({
    parentDirectoryId: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(["saved"]);
  const visible = ref(false);


  const isDark = usePreferredDark();
  const editorLanguage = computed(() => {
    if (fileData.value.extension === "html") return "html";
  });
</script>
