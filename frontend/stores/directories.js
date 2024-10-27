export const useDirectoriesStore = defineStore('dirs',() => {
  const toast = useToastService()
  const loading = ref(false)

  async function createDirectory({
    name,
    parentId,
  }) { 
    loading.value = true
    try {
      const response = await $api('/directories', {
        method: 'POST',
        body: {
          name,
          parent_directory: parentId,
          type: 'directory'
        }
      })
      toast.add({
        severity: 'success',
        summary: 'Directorio',
        detail: 'Directorio creado correctamente',
        life: 3000
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Directorio',
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

  async function deleteFile(id, directoryId) {
    loading.value = true
    try {
      const response = await $api(`/directories/${directoryId}/files/${id}`, {
        method: 'DELETE',
      })
      toast.add({
        severity: 'success',
        summary: 'Archivo',
        detail: 'Archivo eliminado correctamente',
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

  async function deleteDirectory(id) {
    loading.value = true
    try {
      const response = await $api(`/directories/${id}`, {
        method: 'DELETE',
      })
      toast.add({
        severity: 'success',
        summary: 'Directorio',
        detail: 'Directorio eliminado correctamente',
        life: 3000
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Directorio',
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

  async function getAllDirectoriesTrash() {
    loading.value = true
    try {
      const response = await $api('/directories/trash')
      return {response, error: null}
    } catch (error) {
      return {
        error: error.data.message ?? error.name
      } 
    } finally {
      loading.value = false
    }
  }

  async function getOnlyDirectories(directoryId) {
    loading.value = true
    try {
      const response = await $api(directoryId ? `/directories/folders/${directoryId}` : '/directories/folders')
      return {response, error: null}
    } catch (error) {
      return {
        error: error.data.message ?? error.name
      } 
    } finally {
      loading.value = false
    }
  }

  async function uploadFileToDirectory({
    file,
    directoryId,
  }) {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await $api(`/directories/${directoryId}/files`, {
        method: 'POST',
        body: formData
      })
      toast.add({
        severity: 'success',
        summary: 'Archivo',
        detail: 'Archivo subido correctamente',
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

  async function duplicateArchive({ archiveId, type }) {
    loading.value = true
    try {
      const reqConfig = {
        url: type === 'directory' ? `/directories/${archiveId}` : `/files/${archiveId}`,
        
      }
      const response = await $api(reqConfig.url, {
        method: 'PATCH',
        body: {
          action: 'duplicate'
        }
      })
      toast.add({
        severity: 'success',
        summary: `${type === 'directory' ? 'Directorio' : 'Archivo'}`,
        detail: `${type === 'directory' ? 'Directorio' : 'Archivo'} duplicado correctamente`,
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

  async function moveArchive({ archiveId, type, directoryId }) {
    loading.value = true
    try {
      const reqConfig = {
        url: type === 'directory' ? `/directories/${archiveId}` : `/files/${archiveId}`,
        
      }
      const response = await $api(reqConfig.url, {
        method: 'PATCH',
        body: {
          action: 'move',
          new_parent_id: directoryId
        }
      })
      toast.add({
        severity: 'success',
        summary: `${type === 'directory' ? 'Directorio' : 'Archivo'}`,
        detail: `${type === 'directory' ? 'Directorio' : 'Archivo'} movido correctamente`,
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
    createDirectory,
    deleteDirectory,
    getAllDirectoriesTrash,
    uploadFileToDirectory,
    duplicateArchive,
    getOnlyDirectories,
    moveArchive,
    deleteFile,
    loading,
  }
})