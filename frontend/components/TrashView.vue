<template>
  <div
    class="w-full"
    :class="{
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : subarchives.length > 0,
    }"
  >
  <Message v-if="subarchives.length === 0" severity="info" icon="pi pi-info-circle" class="!w-full">
    Esta carpeta está vacía
  </Message>
    <Card
      pt:root:class="hover:bg-primary/5 !shadow-none border-2 border-primary/10 hover:shadow-md transition-all !select-none"
      v-for="archive in subarchives"
      :key="archive._id"
      @contextmenu="onFolderRightClick($event, archive._id)"
      :class="{ '!border-primary-400': selected === archive._id }"
    >
      <template #content>
        <div class="flex flex-col items-center gap-y-2">
          <Icon
            name="lucide:folder-open"
            class="text-primary-400 select-none"
            size="42"
          />
          <h6 class="select-none">{{ archive.name }}</h6>
          <span class="text-xs text-muted-color-emphasis inline-flex items-center gap-1">
            <Icon name="lucide:circle-user" class="!text-sm" />
            {{ archive.owner.username }}
          </span>
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
  const { loading } = storeToRefs(useDirectoriesStore());
  const { deleteDirectory } = useDirectoriesStore();
  defineProps({
    subarchives: {
      type: Array,
      required: true,
      default: () => [],
    }
  });

  const emit = defineEmits(["deleted"]);

  const selected = ref(null);
  const selectedDirectory = ref(null);

  const visible = ref(false);

  const menu = ref();
  const items = ref([
    { label: "Duplicar", icon: "pi pi-copy" },
    {
      label: "Eliminar",
      icon: "pi pi-trash",
      command: () => {visible.value = true; },
    },
  ]);

  const onFolderRightClick = (event, id) => {
    menu.value.show(event);
    selected.value = id;
    selectedDirectory.value = id
  };

  const handleDeleteDirectory = async () => {
    const response = await deleteDirectory(selectedDirectory.value);
    if (!response.error) {
      emit("deleted");
    }
    visible.value = false;
  };
</script>
<style scoped></style>
