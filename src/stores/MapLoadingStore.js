import { defineStore } from 'pinia'

export const useMapLoadingStore = defineStore({
  id: 'mapLoading',
  state: () => ({
    loading: false
  }),
  actions: {
    startLoading() {
      this.loading = true
    },
    stopLoading() {
      this.loading = false
    }
  }
})
