<template>
  <div class="w-full min-h-full" v-if="data?.file">
    <header>
      <span
        class="text-2xl font-semibold text-color flex md:iems-center flex-col pb-1"
      >
        <span class="flex items-center">
          <Button :as="NuxtLink" :to="backRoute" class="mr-4" text>
            <Icon name="lucide:arrow-left" />
          </Button>
          Visualización de archivo
        </span>
      </span>
      <div class="flex items-center justify-between">
        <span
          class="font-mono text-muted-color-emphasis inline-flex items-center py-1"
        >
          <Icon name="lucide:file-text" class="mr-2" />
          <Skeleton width="10rem" height="1.5rem"
          v-if="status === 'pending'"
          />
          <span v-else>
            {{ data.file.name }}
          </span>
        </span>
        <Button
          text
          size="small"
          @click="handleSaveChanges"
          :disabled="status === 'pending'"
          v-if="data.file.mime_type.includes('text') && !readonly"
        >
          <Icon name="lucide:save" />
          Guardar cambios
        </Button>
      </div>
    </header>
    <Divider class="!mb-2" />
    <FileDetailImage
      :data
      :status
      :readonly
      v-if="data.file.mime_type.includes('image')"
      @update="$emit('update')"
    />
    <FileDetailText
      :data
      :status
      :readonly
      v-else-if="data.file.mime_type.includes('text')"
      @update="$emit('update')"
    />
  </div>
</template>
<script setup>
  import { NuxtLink } from "#components";

  const { data } = defineProps({
    data: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    backRoute: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  });

  defineEmits(["update"]);

  const { updatePlainContent } = useFilesStore();

  const handleSaveChanges = async () => {
    const repsonse = await updatePlainContent({
      fileId: data.file._id,
      newContent: data.content,
    });
    if (repsonse) {
      emit("update");
    }
  };
</script>
<style lang="postcss" scoped></style>
