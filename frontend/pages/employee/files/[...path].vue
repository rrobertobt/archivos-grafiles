<template>
  <div class="w-full">
    <Breadcrumb 
    pt:root:class="!bg-surface-50 rounded-xl "
    class="mb-4"
    :home="{ icon: 'lucide:folder-root', to:'/employee/files', label: 'Inicio'}" :model="breadcrumbItems">
    <template #item="{ item, props }">
      <NuxtLink :to="item.to" class="flex items-center gap-x-2 hover:underline">
        <Icon :name="item.icon" v-if="item.icon"/>
        {{ item.label }}</NuxtLink>
    </template>
    </Breadcrumb>
    <div class=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <!-- replace manually created cards with a v-for -->
      <Card @dblclick="navigateTo('/employee/files/aslkjdfkads')"
        pt:root:class="hover:bg-primary/5 !shadow-none border-2 border-primary/10 hover:shadow-md transition-all"
        v-for="i in 6" :key="i"
        @click="()=>{if(selected === i ) selected = null}"
        @contextmenu="onFolderRightClick($event, i)"
        :class="{ '!border-primary-500': selected === i }">
        <template #content>
          <div class="flex flex-col items-center gap-y-2">
            <Icon name="lucide:folder-open" class="text-blue-400 select-none" size="42" />
            <h6 class="select-none">Folder name</h6>
          </div>
        </template>
      </Card>

     
      <ContextMenu ref="menu" :model="items" />
    </div>
  </div>
</template>
<script setup>

const route = useRoute();

const breadcrumbItems = computed(() => {
  return !route.params.path ? [] : route.params.path.map((item,index) => {
    return {
      label: item,
      to: `/employee/files/${route.params.path.slice(0, index + 1).join('/')}`,
    };
  })
})

const selected = ref(null);

const menu = ref();
const items = ref([
  { label: 'Copy', icon: 'pi pi-copy' },
  { label: 'Rename', icon: 'pi pi-file-edit' }
]);

const onFolderRightClick = (event, id) => {
  menu.value.show(event);
  selected.value = id;
};
defineProps({
  atRoot: Boolean,
});
definePageMeta({
  layout: "employee",
});
</script>
<style scoped></style>