<template>
  <div
    class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  >
    <Card
      pt:root:class="hover:bg-primary/5 !shadow-none border-2 border-primary/10 hover:shadow-md transition-all"
      v-for="archive in subarchives"
      @dblclick="navigateTo(
        role === 'employee'
          ? `/employee/files/folder/${archive._id}`
          : `/admin/files/folder/${archive._id}`
      )"
      :key="archive._id"
      @click="
        () => {
          if (selected === i) selected = null;
        }
      "
      @contextmenu="onFolderRightClick($event, i)"
      :class="{ '!border-primary-500': selected === i }"
    >
      <template #content>
        <div class="flex flex-col items-center gap-y-2">
          <Icon
            name="lucide:folder-open"
            class="text-blue-400 select-none"
            size="42"
          />
          <h6 class="select-none">{{ archive.name }}</h6>
        </div>
      </template>
    </Card>

    <ContextMenu ref="menu" :model="items" />
  </div>
</template>
<script setup>
  defineProps({
    subarchives: {
      type: Array,
      required: true,
      default: () => [],
    },
    role: {
      type: String,
      required: true,
    },
  });

  const selected = ref(null);

  const menu = ref();
  const items = ref([
    { label: "Copy", icon: "pi pi-copy" },
    { label: "Rename", icon: "pi pi-file-edit" },
  ]);

  const onFolderRightClick = (event, id) => {
    menu.value.show(event);
    selected.value = id;
  };
</script>
<style scoped></style>
