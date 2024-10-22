<template>
  <main>
    <header class="flex py-4 px-12 lg:max-w-screen-2xl mx-auto">
      <h2 class="text-xl font-normal flex items-center">
        <Icon name="lucide:folder-closed" class="mr-2 hidden md:block" />
        GraFiles - &nbsp;<span class="font-semibold"> Administrador</span>
      </h2>
    </header>
    <Divider pt:root:class="!mt-0" />
    <div class="flex gap-x-7 px-16 lg:max-w-screen-2xl mx-auto">
      <div class="w-64 shrink-0 hidden lg:block">
        <Menu
          :model="[
            {
              label: 'Inicio',
              icon: 'lucide:house',
              to: '/admin',
            },
          ]"
          class="!border-none !bg-transparent"
        >
          <template #item="{ item, props }">
            <NuxtLink
              active-class="!bg-primary/30"
              class="flex items-center p-2 rounded-lg my-0.5"
              :to="item.to"
            >
              <Icon :name="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
          </template>
        </Menu>

        <h4 class="text-lg my-2 font-semibold">Ubicaciones</h4>

        <Menu :model="sidebarItems" class="py-0 !border-none !bg-transparent">
          <template #item="{ item, props }">
            <!-- {{ item }} -->
            <NuxtLink
              active-class="!bg-primary/30"
              class="flex items-center p-2 rounded-lg my-0.5"
              :to="item.to"
            >
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
      label: "Papelera",
      icon: "lucide:trash",
      to: "/admin/trash",
    },
  ]);


import { AuraWithAmber } from '~/themes/themes';
const pv = usePrimeVue()
pv.config.theme.options = AuraWithAmber.options
pv.config.theme.preset = AuraWithAmber
</script>
<style scoped>
</style>