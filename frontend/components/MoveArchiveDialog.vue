<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Mover hacia..."
    class="w-10/12 lg:w-3/12"
    @hide="selected = {}"
  >

    <div class="h-full">
      <p>Selecciona la carpeta a la que deseas mover este elemento.</p>
      <div class="flex flex-col justify-between h-full">
        <Tree
          :value="data?.response"
          :selection-keys="selected"
          @node-expand="handleNodeExpand"
          @node-select="handleNodeSelect"
          @node-unselect="handleNodeUnselect"
          loadingMode="icon"
          class="!w-full !px-0"
          selectionMode="single"
        >
          <template #default="{ node }">
            <span>{{ node.label }}</span>
          </template>
        </Tree>
        <Button
          type="button"
          label="Mover"
          fluid
          icon="pi pi-check"
          color="primary"
          :loading="loading"
          :disabled="Object.keys(selected).length === 0"
          @click="emit('submit', Object.keys(selected)[0])"
          class="mt-4"
        />
      </div>
    </div>
  </Dialog>
</template>
<script setup>
  const directoriesStore = useDirectoriesStore();
  const { getOnlyDirectories } = directoriesStore;
  const { loading } = storeToRefs(directoriesStore);
  const { session } = storeToRefs(useSessionStore());

  const route = useRoute();
  const selected = ref({});

  const handleNodeSelect = (node) => {
    if (
      (node.key === session.value.root_directory && !route.params.folderId) ||
      node.key === route.params.folderId
    )
      return;
    selected.value = {};
    selected.value[node.key] = true;
  };

  const handleNodeUnselect = (node) => {
    delete selected.value[node.key];
  };

  const handleNodeExpand = async (node) => {
    const { key } = node;
    node.loading = true;
    const response = await getOnlyDirectories(key);
    node.children = response.response;
    node.loading = false;
  };

  const emit = defineEmits(["submit"]);
  const visible = defineModel("visible", {
    default: false,
    type: Boolean,
  });
  const { data } = await useAsyncData(() => getOnlyDirectories(), {
    immediate: false,
    watch: [visible],
  });
</script>
