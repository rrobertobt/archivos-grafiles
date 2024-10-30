<template>
  <div class="mb-4">
    <Button label="Crear archivo" @click="visible = true" color="primary">
      <template #icon>
        <Icon name="lucide:file-plus" />
      </template>
    </Button>
    <Dialog v-model:visible="visible" modal header="Crear directorio" class="w-10/12 lg:w-3/12">
      <form
        class="flex flex-col gap-4"
        @submit.prevent="handleSubmitDirectory"
      >
        <FloatLabel variant="in">
          <InputText
          fluid
            :disabled="loading"
            v-model="fileName"
            id="folder-name"
            class="flex-auto"
            autocomplete="off"
            autofocus
          />
          <label for="folder-name">Nombre</label>
        </FloatLabel>
        <Button type="submit" color="primary" :loading="loading">
          Crear
        </Button>
      </form>
    </Dialog>
  </div>
</template>
<script setup>
  const directoriesStore = useDirectoriesStore();
  const { createDirectory } = directoriesStore;
  const { loading } = storeToRefs(directoriesStore);

  const fileName = ref("");

  const handleSubmitDirectory = async () => {
    const response = await createDirectory({
      name: fileName.value,
      parentId: parentDirectoryId,
    });
    if (!response.error) {
      visible.value = false;
      fileName.value = "";
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
