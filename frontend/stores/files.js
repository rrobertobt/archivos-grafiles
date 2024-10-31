export const useFilesStore = defineStore('files',() => {
  const toast = useToastService()
  const loading = ref(false)

  async function shareFileToUser({
    username,
    fileId,
  }) {
    loading.value = true
    try {
      const response = await $api(`/files/${fileId}`, {
        method: 'PATCH',
        body: {
          action: 'share',
          username,
        }
      })
      toast.add({
        severity: 'success',
        summary: 'Archivo',
        detail: 'Archivo compartido correctamente',
        life: 3000
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Archivo',
        detail: error.data.message ?? error.name,
        life: 3000
      })
      return {
        error: error.data.message ?? error.name
      } 
    } finally {
      loading.value = false
    }
  }

  // this function only for txt and html files
  async function updatePlainContent({
    fileId,
    newContent,
  }) {
    loading.value = true
    try {
      const response = await $api(`/files/${fileId}`, {
        method: 'PATCH',
        body: {
          action: 'content',
          content: newContent,
        }
      })
      toast.add({
        severity: 'success',
        summary: 'Archivo',
        detail: 'Contenido actualizado correctamente',
        life: 3000
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Archivo',
        detail: error.data.message ?? error.name,
        life: 3000
      })
      return {
        error: error.data.message ?? error.name
      } 
    } finally {
      loading.value = false
    }
  }

  async function updateImageContent({
    fileId,
    newFile,
  }) {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('file', newFile)
      const response = await $api(`/files/${fileId}/upload`, {
        method: 'PATCH',
        body: formData,
      })
      toast.add({
        severity: 'success',
        summary: 'Archivo',
        detail: 'Contenido actualizado correctamente',
        life: 3000
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Archivo',
        detail: error.data.message ?? error.name,
        life: 3000
      })
      return {
        error: error.data.message ?? error.name
      } 
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    shareFileToUser,
    updatePlainContent,
    updateImageContent,
  }
})