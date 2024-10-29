<template>
  <div
    class="w-full"
    :class="{
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4':
        subarchives.length > 0,
    }"
  >
    <Message
      v-show="subarchives.length === 0"
      severity="info"
      icon="pi pi-info-circle"
    >
      {{ emptyMessage }}
    </Message>
    <Card
      pt:root:class="hover:bg-primary/5 !shadow-none border-2 border-primary/10 hover:shadow-md transition-all !select-non"
      v-for="archive in subarchives"
      @dblclick="
        navigateTo(
          archive.type === 'directory'
            ? role === 'employee'
              ? `/employee/files/folder/${archive._id}`
              : `/admin/files/folder/${archive._id}`
            : `/employee/files/file/${archive._id}`,
        )
      "
      :key="archive._id"
      @contextmenu="onFolderRightClick($event, archive._id, archive.type)"
      :class="{ '!border-primary-400': selected === archive._id }"
    >
      <template #content>
        <div class="flex flex-col items-center gap-y-2">
          <Icon
            :name="getArchiveIcon(archive)"
            class="text-primary-400"
            size="42"
          />
          <h6 class="">{{ archive.name }}</h6>
          <span
            class="text-xs text-muted-color-emphasis font-mono"
            v-if="archive.type === 'file'"
          >
            {{ archive.mime_type ?? "" }}
          </span>
        </div>
      </template>
    </Card>

    <ContextMenu ref="menu" :model="items" @hide="selected = null">
    </ContextMenu>

    <Dialog
      v-model:visible="visible"
      modal
      header="Enviar a la papelera"
      class="w-10/12 lg:w-3/12"
    >
      <div class="flex flex-col gap-4">
        <p>¿Estás seguro de que deseas enviar a la papelera este elemento?</p>

        <div class="flex justify-between gap-2">
          <Button
            fluid
            type="button"
            label="Cancelar"
            :loading="loading"
            severity="secondary"
            class="mr-2"
            @click="visible = false"
          />
          <Button
            fluid
            type="button"
            :loading="loading"
            label="Eliminar"
            severity="danger"
            @click="handleDeleteDirectory"
          />
        </div>
      </div>
    </Dialog>

    <MoveArchiveDialog
      v-model:visible="moveVisible"
      @submit="handleMoveArchive($event)"
    />

    <ShareFileDialog
      v-model:visible="shareVisible"
      :selected-id="selectedDirectory"
    />
  </div>
</template>
<script setup>
  import ShareFileDialog from "./ShareFileDialog.vue";

  const getArchiveIcon = (archive) => {
    switch (archive.type) {
      case "directory":
        return "lucide:folder-open";
      case "file":
        if (archive.mime_type.includes("image")) {
          return "lucide:file-image";
        } else if (archive.mime_type.includes("html")) {
          return "lucide:file-code-2";
        } else {
          return "lucide:file-text";
        }
    }
  }

  const { loading } = storeToRefs(useDirectoriesStore());
  const { deleteDirectory, deleteFile, duplicateArchive, moveArchive } =
    useDirectoriesStore();
  const { currentDirectory } = defineProps({
    subarchives: {
      type: Array,
      required: true,
      default: () => [],
    },
    role: {
      type: String,
      required: true,
    },
    currentDirectory: {
      type: String,
      required: true,
    },
    emptyMessage: {
      type: String,
      default: "Esta carpeta está vacía",
    },
  });

  const emit = defineEmits(["deleted"]);

  const selected = ref(null);
  const selectedDirectory = ref(null);
  const selectedType = ref(null);

  // Dialogs visibility
  const visible = ref(false);
  const moveVisible = ref(false);
  const shareVisible = ref(false);

  const menu = ref();
  const items = ref([
    {
      label: "Mover...",
      icon: "pi pi-arrow-right",
      command: () => {
        moveVisible.value = true;
      },
    },
    {
      label: "Duplicar",
      icon: "pi pi-copy",
      command: () => handleDuplicateArchive(),
    },
    {
      label: "Compartir con...",
      icon: "pi pi-share-alt",
      command: () => {
        shareVisible.value = true;
      },
    },
    {
      label: "Eliminar...",
      icon: "pi pi-trash",
      command: () => {
        visible.value = true;
      },
    },
  ]);

  const onFolderRightClick = (event, id, type) => {
    menu.value.show(event);
    selected.value = id;
    selectedDirectory.value = id;
    selectedType.value = type;
    items.value[2].disabled = type === "directory";
  };

  const handleDeleteDirectory = async () => {
    const response =
      selectedType.value === "directory"
        ? await deleteDirectory(selectedDirectory.value)
        : await deleteFile(selectedDirectory.value, currentDirectory);
    if (!response.error) {
      emit("deleted");
    }
    visible.value = false;
  };

  const handleDuplicateArchive = async () => {
    await duplicateArchive({
      archiveId: selectedDirectory.value,
      type: selectedType.value,
    });
    emit("deleted");
  };

  const handleMoveArchive = async (newParentId) => {
    console.log(newParentId);
    const response = await moveArchive({
      archiveId: selectedDirectory.value,
      type: selectedType.value,
      directoryId: newParentId,
    });
    if (!response.error) {
      emit("deleted");
      moveVisible.value = false;
    }
  };
</script>
<style scoped></style>
