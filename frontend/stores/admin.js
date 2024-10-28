export const useAdminStore = defineStore('admin',() => {
  const toast = useToastService()
  const loading = ref(false)

  async function getAllEmployees() {
    loading.value = true
    try {
      const response = await $api('/users/employees', {
        method: 'GET',
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
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

  async function getEmployee(id) {
    loading.value = true
    try {
      const response = await $api(`/users/employees/${id}`, {
        method: 'GET',
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
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

  async function createEmployee(payload) {
    console.log(payload)
    loading.value = true
    try {
      const response = await $api('/users', {
        method: 'POST',
        body: payload
      })
      toast.add({
        severity: 'success',
        summary: 'Usuario',
        detail: 'Usuario creado correctamente',
        life: 3000
      })
      return {response, error: null}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Usuario',
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
    getAllEmployees,
    getEmployee,
    createEmployee
  }
})