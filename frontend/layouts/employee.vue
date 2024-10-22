<template>
  <main class="">
    <header class="flex py-4 px-12 lg:max-w-screen-2xl mx-auto">
      <h2 class="text-xl font-normal flex items-center">
        <Icon name="lucide:folder-closed" class="mr-2 hidden md:block" />
        GraFiles -&nbsp;<span class="font-semibold">Empleado</span>
      </h2>
    </header>
    <Divider pt:root:class="!mt-0" />
    <div class="flex gap-x-7 px-16 lg:max-w-screen-2xl mx-auto">
      <div class="w-64 shrink-0 hidden lg:block">
        <Menu :model="[
          {
            label: 'Inicio',
            icon: 'lucide:house',
            to: '/employee',
          },
        ]" :pt="{
          root: { class: '!border-none ' },
          itemContent: { class: 'hover:!bg-primary/20 !rounded-lg' },
        }">
          <template #item="{ item, props }">
            <NuxtLink active-class="!bg-primary/30" class="flex items-center p-2 rounded-lg my-0.5" :to="item.to">
              <Icon :name="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
          </template>
        </Menu>

        <h4 class="text-lg my-2 font-semibold">Ubicaciones</h4>

        <Menu :model="sidebarItems" :pt="{
          root: { class: '!border-none ' },
          itemContent: { class: 'hover:!bg-primary/20 !rounded-lg' },
        }">
          <!-- <Menu :model="sidebarItems" class="py-0 !border-none" :pt:itemContent:class="'!bg-indigo-500'"> -->
          <template #item="{ item, props }">
            <NuxtLink class="flex items-center p-2 rounded-lg my-0.5"
            :class="{
              '!bg-primary/30': $route.path.includes(item.to)
            }"
            active-class="!bg-primary/30" :to="item.to">
              <Icon :name="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
          </template>
        </Menu>
      </div>
      <NuxtPage />
    </div>
  </main>
</template>
<script setup>
const sidebarItems = ref([
  {
    label: "Mis archivos",
    icon: "lucide:hard-drive",
    to: "/employee/files",
    func: ()=>{console.log('something')}
  },
  {
    label: "Compartidos",
    icon: "lucide:folder-sync",
    to: "/employee/shared",
  },
]);

import { AuraWithIndigo } from "~/themes/themes";
const pv = usePrimeVue();
pv.config.theme.options = AuraWithIndigo.options;
pv.config.theme.preset = AuraWithIndigo;
</script>
<style scoped></style>
