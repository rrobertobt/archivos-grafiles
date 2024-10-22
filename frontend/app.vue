<template>
  <div>
    <!-- <Button label="Toggle Dark Mode" size="small" @click="toggleDarkMode()" /> -->
    <NuxtLoadingIndicator :height="2" color="var(--p-primary-color)" />
    <NuxtLayout>
      <slot />
    </NuxtLayout>
  </div>
</template>
<script setup>
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
</style>
