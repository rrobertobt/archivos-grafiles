<template>
  <div>
    <SelectButton
      v-model="viewOption"
      :allow-empty="false"
      :disabled="loading || readonly"
      :options="['Ver', 'Editar']"
      class="!text-xs mb-2 block"
    />
    <Message
      severity="warn"
      icon="pi pi-exclamation-triangle"
      class="w-full mb-4"
      v-show="viewOption === 'Editar'"
    >
      Al editar el archivo de imagen, se reemplazará el archivo original.
    </Message>
    <ProgressSpinner class="w-full block" v-if="status === 'pending'" />
    <figure
      class="flex items-center w-full md:w-5/12 justify-center"
      v-if="viewOption === 'Ver' && status === 'success'"
    >
      <img :src="data.content" alt="file" class="w-full" />
    </figure>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmitFile" v-if="viewOption === 'Editar'">
      <FileUpload
        mode="advanced"
        :file-limit="1"
        @select="(e) => (selectedFile = e.files[0])"
      >
        <template #header="{ chooseCallback }">
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
        <template #content="{ files, removeFileCallback }">
          <div
            v-if="files.length > 0"
            class="flex justify-between flex-col gap-y-2"
          >
            <span class="flex items-center gap-2">
              <Icon name="lucide:file" />
              <span>{{ files[0].name }}</span>
            </span>
            <Button
              label="Eliminar"
              @click="
                () => {
                  removeFileCallback(0);
                  selectedFile = null;
                }
              "
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

      <Button
        type="submit"
        icon="pi pi-check"
        color="primary"
        :loading="loading"
        label="Subir"
        :disabled="!selectedFile"
      />
    </form>
  </div>
</template>
<script setup>
  const filesStore = useFilesStore();
  const { loading } = storeToRefs(filesStore);
  const { updateImageContent } = filesStore;

  const selectedFile = ref(null);

  const emit = defineEmits(["update"]);
  const { data } = defineProps({
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  });

  const handleSubmitFile = async () => {
    console.log(selectedFile.value);
    const response = await updateImageContent({
      newFile: selectedFile.value,
      fileId: data.file._id,
    });
    if (!response.error) {
      emit("update");
      viewOption.value = "Ver";
      selectedFile.value = null;
    }
  };

  const viewOption = ref("Ver");
</script>
<style lang="postcss" scoped></style>
