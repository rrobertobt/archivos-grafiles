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
      pt:root:class="hover:bg-primary/5 !shadow-none border-2 border-primary/10 hover:shadow-md transition-all !select-none"
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
            :name="
              archive.type === 'directory'
                ? 'lucide:folder-open'
                : 'lucide:file-text'
            "
            class="text-primary-400"
            size="42"
          />
          <h6 class="text-center">{{ archive.name }}</h6>
          <span
            class="text-xs text-muted-color-emphasis inline-flex items-center gap-1"
          >
            <Icon name="lucide:circle-user" class="!text-sm" />
            {{ archive.shared_by.username }} <span class="font-bold">-</span>
            {{ archive.shared_by.name }}
          </span>
          <span
            class="text-xs text-muted-color-emphasis inline-flex items-center gap-1"
          >
            <Icon name="lucide:calendar" class="!text-sm" />
            {{ new Date(archive.created_at).toLocaleDateString("es-GT") }}
            <span class="font-bold">-</span>
            <Icon name="lucide:clock" class="!text-sm" />
            {{
              new Date(archive.created_at).toLocaleTimeString("es-GT", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            }}
          </span>
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
      v-model:visible="deleteVisible"
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
            @click="deleteVisible = false"
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
  </div>
</template>
<script setup>
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

  const deleteVisible = ref(false);

  const selected = ref(null);
  const selectedDirectory = ref(null);
  const selectedType = ref(null);

  const menu = ref();
  const items = ref([
    {
      label: "Eliminar...",
      icon: "pi pi-trash",
      command: () => (deleteVisible.value = true),
    },
  ]);

  const handleDeleteDirectory = async () => {
    const response = await deleteFile(selectedDirectory.value, currentDirectory);
    if (!response.error) {
      emit("deleted");
    }
    deleteVisible.value = false;
  };

  const onFolderRightClick = (event, id, type) => {
    menu.value.show(event);
    selected.value = id;
    selectedDirectory.value = id;
    selectedType.value = type;
  };
</script>
<style scoped></style>
