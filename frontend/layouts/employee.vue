<template>
  <main class="">
    <Drawer v-model:visible="drawerOpen" header="Menu">
      <template #footer>
        <Divider />
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold inline-flex items-center gap-x-2">
              <Icon name="lucide:user" />
              {{ session?.name }}
            </h4>
            <Button
              label="Cerrar sesión"
              icon="pi pi-sign-out"
              class="!text-xs"
              severity="danger"
              text
              @click="logout"
              size="small"
            />
        </div>
      </template>

      <h4 class="text-lg my-2 font-semibold select-none">Ubicaciones</h4>

      <Menu
        :model="sidebarItems"
        :pt="{
          root: { class: '!border-none ' },
          itemContent: { class: 'hover:!bg-primary/20 !rounded-lg' },
        }"
      >
        <template #item="{ item, props }">
          <NuxtLink
            class="flex items-center p-2 rounded-lg my-0.5"
            :class="{
              '!bg-primary/30': $route.path.includes(item.to),
            }"
            active-class="!bg-primary/30"
            :to="item.to"
            @click="drawerOpen = false"
          >
            <Icon :name="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </NuxtLink>
        </template>
      </Menu>

      <h4 class="text-lg my-2 font-semibold select-none">Administración</h4>

        <Menu
          :model="[
            { label: 'Perfil', icon: 'lucide:user-pen', to: '/employee/profile' },
          ]"
          class="!border-none !bg-transparent"
        >
          <template #item="{ item, props }">
            <NuxtLink
              active-class="!bg-primary/30"
              class="flex items-center p-2 rounded-lg my-0.5"
              :to="item.to"
              @click="drawerOpen = false"
            >
              <Icon :name="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
          </template>
        </Menu>
    </Drawer>
    <header
      class="flex py-4 px-4 lg:px-12 lg:max-w-screen-2xl mx-auto w-full justify-between"
    >
      <Button
        v-tooltip.left="{
          value: 'Menú',
          pt: {
            text: '!font-medium !text-xs !p-1.5',
          },
        }"
        icon="pi pi-bars"
        text
        severity="secondary"
        size="small"
        @click="drawerOpen = !drawerOpen"
        class="lg:!hidden"
      />
      <h2 class="text-xl font-normal flex items-center">
        <Icon name="lucide:folder-closed" class="mr-2 hidden md:block" />
        GraFiles -&nbsp;<span class="font-semibold">Empleado</span>
      </h2>
      <div class="items-center gap-x-4 hidden lg:flex">
        <h4 class="text-sm font-semibold inline-flex items-center gap-x-2">
          <Icon name="lucide:user" />
          {{ session?.name }}
        </h4>
        <Button
          v-tooltip.bottom="{
            value: 'Cerrar sesión',
            pt: {
              text: '!font-medium !text-xs !p-1.5',
            },
          }"
          icon="pi pi-sign-out"
          severity="danger"
          text
          @click="logout"
          size="small"
        />
      </div>
    </header>
    <Divider pt:root:class="!mt-0" />
    <div class="flex gap-x-7 lg:px-16 px-4 lg:max-w-screen-2xl mx-auto">
      <div class="w-64 shrink-0 hidden lg:block">
        <h4 class="text-lg my-2 font-semibold select-none">Ubicaciones</h4>

        <Menu
          :model="sidebarItems"
          :pt="{
            root: { class: '!border-none ' },
            itemContent: { class: 'hover:!bg-primary/20 !rounded-lg' },
          }"
        >
          <template #item="{ item, props }">
            <NuxtLink
              class="flex items-center p-2 rounded-lg my-0.5"
              :class="{
                '!bg-primary/30': $route.path.includes(item.to),
              }"
              active-class="!bg-primary/30"
              :to="item.to"
            >
              <Icon :name="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </NuxtLink>
          </template>
        </Menu>

        <h4 class="text-lg my-2 font-semibold select-none">Administración</h4>

        <Menu
          :model="[
            { label: 'Perfil', icon: 'lucide:user-pen', to: '/employee/profile' },
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
      </div>
      <NuxtPage />
    </div>
  </main>
</template>
<script setup>
  const sessionStore = useSessionStore();
  const { logout } = sessionStore;
  const { session } = storeToRefs(sessionStore);

  const drawerOpen = ref(false);

  const sidebarItems = ref([
    {
      label: "Mis archivos",
      icon: "lucide:hard-drive",
      to: "/employee/files",
    },
    {
      label: "Compartidos",
      icon: "lucide:folder-sync",
      to: "/employee/shared",
    }
  ]);

  import { AuraWithIndigo } from "~/themes/themes";
  const pv = usePrimeVue();
  pv.config.theme.options = AuraWithIndigo.options;
  pv.config.theme.preset = AuraWithIndigo;
</script>
<style scoped></style>
