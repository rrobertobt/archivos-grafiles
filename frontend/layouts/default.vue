<template>
  <div>
    <NuxtPage />
  </div>
</template>
<script setup>
import { AuraWithNoir } from '~/themes/themes';
const pv = usePrimeVue()
console.log(pv.config.theme)
pv.config.theme.options = AuraWithNoir.options
pv.config.theme.preset = AuraWithNoir
</script>
<style scoped>
</style>