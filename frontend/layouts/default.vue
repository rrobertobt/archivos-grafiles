<template>
  <div>
    <NuxtPage />
  </div>
</template>
<script setup>
import { AuraWithNoir } from '~/themes/themes';
const pv = usePrimeVue()
pv.config.theme.options = AuraWithNoir.options
pv.config.theme.preset = AuraWithNoir
</script>
<style scoped>
</style>