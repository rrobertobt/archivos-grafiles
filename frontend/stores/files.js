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

  return {
    loading,
    shareFileToUser,
  }
})