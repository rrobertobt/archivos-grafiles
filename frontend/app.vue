<template>
  <div>
    <!-- <Button label="Toggle Dark Mode" size="small" @click="toggleDarkMode()" /> -->
    <NuxtLoadingIndicator
      :height="3"
      color="var(--p-primary-color)"
      :throttle="20"
    />
    <NuxtLayout>
      <slot />
    </NuxtLayout>
    <Toast
      position="top-right"
      :pt="{
        detail: { class: '!text-xs' },
        summary: { class: '!text-sm !font-semibold' },
      }"
    />
  </div>
</template>
<script setup>
  import { breakpointsTailwind } from "@vueuse/core";
  import Toast from "primevue/toast";
  // const {smaller} = useBreakpoints(breakpointsTailwind);

  function toggleDarkMode() {
    const element = document.querySelector("html");
    element.classList.toggle("my-app-dark");
  }
  useHead({
    title: "GraFiles",
  });
</script>
<style>
  @import "primeicons/primeicons.css";
  .page-enter-active,
  .page-leave-active {
    transition: all 0.1s ease-in-out;
  }
  .page-leave-to,
  .page-enter-from {
    opacity: 0;
    transform: translateX(0.5rem);
  }

  .layout-enter-active,
  .layout-leave-active {
    transition: all 0.1s ease-in-out;
  }

  .layout-leave-to,
  .layout-enter-from {
    opacity: 0;
    transform: translateX(0.5rem);
  }

  .vue-monaco-editor {
    height: 100%;
    font-family: "Geist Mono", "ui-monospace" !important;
  }
</style>
