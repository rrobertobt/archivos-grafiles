<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Compartir con"
    class="w-10/12 lg:w-3/12"
    @hide="selected = {}"
  >
    <p class="pb-5">
      Escribe el nombre de usuario con el que deseas compartir este archivo.
    </p>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmitDirectory">
      <FloatLabel variant="in">
        <IconField>
          <InputIcon>
            <Icon name="lucide:user-search" />
          </InputIcon>
          <InputText
            fluid
            :disabled="loading"
            v-model="usernameToShare"
            id="folder-name"
            class="flex-auto"
            autocomplete="off"
            autofocus
          />
        </IconField>
        <label for="folder-name">Nombre de usuario</label>
      </FloatLabel>
      <Button
        type="submit"
        color="primary"
        :loading="loading"
        label="Compartir"
      >
        <template #icon>
          <Icon name="lucide:share" />
        </template>
      </Button>
    </form>
  </Dialog>
</template>
<script setup>
  import { useFilesStore } from "~/stores/files";

  const filesStore = useFilesStore();
  const { shareFileToUser } = filesStore;
  const { loading } = storeToRefs(filesStore);

  const usernameToShare = ref("");

  const { selectedId } = defineProps({
    selectedId: String,
  });

  const emit = defineEmits(["submit"]);
  const visible = defineModel("visible", {
    default: false,
    type: Boolean,
  });

  const handleSubmitDirectory = async () => {
    const response = await shareFileToUser({
      fileId: selectedId,
      username: usernameToShare.value,
    });
    if (!response.error) {
      visible.value = false;
      emit("submit");
    }
  };
</script>
