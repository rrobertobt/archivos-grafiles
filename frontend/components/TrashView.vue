<template>
  <div
    class="w-full"
    :class="{
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : subarchives.length > 0,
    }"
  >
  <Message v-show="subarchives.length === 0" severity="info" icon="pi pi-info-circle">
    No hay archivos en la papelera
  </Message>
    <Card
      pt:root:class="hover:bg-primary/5 !shadow-none border-2 border-primary/10 hover:shadow-md transition-all !select-none active:ring-2 active:ring-primary-400"
      v-for="archive in subarchives"
      :key="archive._id"
      :class="{ '!border-primary-400': selected === archive._id }"
    >
      <template #content>
        <div class="flex flex-col items-center gap-y-2">
          <Icon
            :name="getArchiveIcon(archive)"
            class="text-primary-400"
            size="42"
          />
          <h6 class="select-none">{{ archive.name }}</h6>
          <span class="text-xs text-muted-color-emphasis inline-flex items-center gap-1">
            <Icon name="lucide:circle-user" class="!text-sm" />
            {{ archive.owner.username }}
          </span>
          <span class="text-xs text-muted-color-emphasis font-semibold inline-flex items-center gap-1">
            <Icon name="lucide:lock" class="!text-xs"/>
            {{ archive.shared ? 'Compartido' : 'Privado' }}
          </span>
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
  defineProps({
    subarchives: {
      type: Array,
      required: true,
      default: () => [],
    }
  });

  const emit = defineEmits(["deleted"]);

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
  };
</script>
<style scoped></style>
