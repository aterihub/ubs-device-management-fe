import { defineStore } from 'pinia'
import reportApi from '@/services/reportAPI'
import { ref } from 'vue'

export const useReportStore = defineStore('report', () => {
  const reportData = ref([])
  const totalData = ref()
  const isLoading = ref(false)
  const status = ref({
    message: null,
    code: null,
  })
  const loadReport = async () => {
    isLoading.value = true
    try {
      const res = await reportApi.getReport()
      reportData.value = res.data
      totalData.value = res.data.length
      isLoading.value = false
  } catch (err) {
      console.error(err)
      isLoading.value = false
      return err
    } 
  }

  return {
    loadReport, reportData, totalData
  }
})