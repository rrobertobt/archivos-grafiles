<template>
  <div>
    <NuxtLoadingIndicator
      :height="3"
      color="var(--p-primary-color)"
      :throttle="20"
    />
    <NuxtLayout>
      <slot />
    </NuxtLayout>
    <Toast
      :position="smaller('sm').value ? 'bottom-center' : 'top-right'"
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
  const { smaller } = useBreakpoints(breakpointsTailwind);

  function toggleDarkMode() {
    const element = document.querySelector("html");
    element.classList.toggle("my-app-dark");
  }
  useHead({
    title: "GraFiles - Proyecto Archivos",
  });
</script>
<style>
  @import "primeicons/primeicons.css";
  /* .vue-monaco-editor {
    height: 100%;
    font-family: "Geist Mono", "ui-monospace" !important;
  } */
</style>
