<template>
  <div class="mb-4">
    <Button label="Subir archivo" @click="visible = true" color="primary">
      <template #icon>
        <Icon name="lucide:upload" />
      </template>
    </Button>
    <Dialog
      v-model:visible="visible"
      modal
      header="Subir archivo"
      class="w-10/12 lg:w-3/12"
      @after-hide="selectedFile = null"
    >
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmitFile">
        <FileUpload
          mode="advanced"
          :file-limit="1"
          @select="e => selectedFile = e.files[0]"
        >
        <template #header="{chooseCallback}">
          <Button
            label="Seleccionar archivo"
            @click="chooseCallback"
            severity="secondary"
            :disabled="loading || selectedFile"
          >
            <template #icon>
              <Icon name="lucide:upload" />
            </template>
          </Button>
        </template>
        <template #content="{files, removeFileCallback}">
          <div v-if="files.length > 0" class="flex justify-between flex-col gap-y-2">
            <span class="flex items-center gap-2">
              <Icon name="lucide:file" />
              <span>{{ files[0].name }}</span>
            </span>
            <Button
              label="Eliminar"
              @click="()=>{removeFileCallback(0); selectedFile = null}"
              severity="danger"
            >
              <template #icon>
                <Icon name="lucide:trash" />
              </template>
            </Button>
          </div>
        </template>
        <template #empty>
          <p class="text-center">O arrastra el archivo aquí</p>
        </template>
      </FileUpload>

        <Button type="submit" icon="pi pi-check" color="primary" :loading="loading" label="Subir" :disabled="!selectedFile" />
      </form>
    </Dialog>
  </div>
</template>
<script setup>
  const directoriesStore = useDirectoriesStore();
  const { uploadFileToDirectory } = directoriesStore;
  const { loading } = storeToRefs(directoriesStore);

  const selectedFile = ref(null);

  const handleSubmitFile = async () => {
    const response = await uploadFileToDirectory({
      file: selectedFile.value,
      directoryId: parentDirectoryId,
    });
    if (!response.error) {
      visible.value = false;
      selectedFile.value = null;
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
</script>
