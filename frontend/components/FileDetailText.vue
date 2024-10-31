<template>
  <div class="w-full flex-col md:flex-row flex gap-2">
    <div
      class="md:w-1/2 w-full"
      :class="{
        '!w-full': data.file.mime_type.includes('plain'),
      }"
    >
      <div class="flex flex-col gap-y-2 size-full">
        <h6
          class="text-base font-semibold text-color"
          v-if="data.file.mime_type.includes('html')"
        >
          Contenido
        </h6>
        <Textarea
          v-if="data.file.mime_type.includes('text')"
          v-model="data.content"
          autoResize
          :readonly
          rows="20"
          cols="30"
          class="block md:hidden w-full"
        />
        <ClientOnly>
          <VueMonacoEditor
            v-if="data.file.mime_type.includes('text')"
            v-model:value="data.content"
            :theme="isDark ? 'vs-dark' : 'vs'"
            :language="editorLanguage"
            className="ring-2 hidden md:block h-[35rem] w-full ring-primary-emphasis-alt/10 px-1.5 rounded-lg"
            :options="{
              formatOnType: true,
              formatOnPaste: true,
              readOnly: readonly,
              fontFamily: 'Geist Mono, ui-monospace',
              fontSize: 15,
            }"
          >
            {{ "Cargando editor..." }}
          </VueMonacoEditor>
        </ClientOnly>
      </div>
    </div>
    <div
      class="flex flex-col gap-y-2 h-full w-full md:w-1/2"
      v-if="data.file.mime_type.includes('html')"
    >
      <h6 class="text-base font-semibold text-color">Prevista</h6>
      <iframe
        :srcdoc="data.content"
        v-if="data.file.mime_type.includes('html')"
        class="h-[35rem] ring-2 ring-primary-emphasis-alt/10 px-1.5 rounded-lg"
      ></iframe>
    </div>
  </div>
</template>
<script setup>
  import { VueMonacoEditor } from "@guolao/vue-monaco-editor";
  const { data } = defineProps({
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update"]);

  // editor setup
  const isDark = usePreferredDark();
  const editorLanguage = computed(() => {
    const mime = data.file?.mime_type;
    if (mime.includes("html")) return "html";
    return "";
  });
</script>
<style lang="postcss" scoped></style>
