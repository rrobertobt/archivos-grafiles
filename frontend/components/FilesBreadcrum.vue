<template>
  <Breadcrumb class="mb-4 !rounded-lg" :model="displayPath">
    <template #item="{ item }">
      <NuxtLink
        :to="
          role === 'employee'
            ? item.parent_directory
              ? `/employee/files/folder/${item._id}`
              : `/employee/files`
            : item.parent_directory
            ? `/admin/files/folder/${item._id}`
            : `/admin/files`
        "
        class="flex items-center gap-x-2 hover:underline"
      >
        <Icon name="lucide:folder" />
        {{ item.name }}</NuxtLink
      >
    </template>
  </Breadcrumb>
</template>
<script setup>
  defineProps({
    displayPath: {
      type: Array,
      required: true,
      default: () => [],
    },
    role: {
      type: String,
      required: true,
    },
  });
</script>
<style scoped></style>
