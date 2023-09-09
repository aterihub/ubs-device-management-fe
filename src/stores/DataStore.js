import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { computed, ref } from 'vue'

export const useDataStore = defineStore('data', {
  state: () => ({
    dataDensity: ref([]),
    realtimeData: ref([]),
    offlineDevices: ref([]),
    onlineDevices: ref([]),
    realtimeDevicesStatus: ref({}),
    status: ref({
      isError:null,
      message: null,
      code: null,
    }),
    isLoading: ref(false)
  }),
  actions: {
    async getRealtimeData(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getRealtimeData(params)
        console.log(res)
        this.realtimeDevicesStatus = res.data.data.counter
        this.realtimeData = res.data.data.data
        this.offlineDevices = this.realtimeData.filter(data => data.status == 'OFFLINE')
        if (this.offlineDevices.length != 0) {
          this.offlineDevices.map((data,index) => {
            this.offlineDevices[index].uptime = data.uptime/60
          })
        }
        this.onlineDevices = this.realtimeData.filter(data => data.status == 'ONLINE')
        if (this.onlineDevices.length != 0) {
          this.onlineDevices.map((data,index) => {
            this.onlineDevices[index].uptime = data.uptime/60
          })
        }
        this.isLoading = false
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        this.status.message = err.response.data.error
        this.status.code = err.response.data.status
        return err
      }
    },
    async getDataDensity(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getDataDensity(params)
        console.log(res)
        this.isLoading = false
        this.dataDensity = res.data.data
        if (this.dataDensity.length != 0) {
          this.dataDensity.map((data,index) => {
            this.dataDensity[index]._time = new Date(data._time).toLocaleString()
            this.dataDensity[index].PowerMesinPercentage = Math.floor((data.PowerMesin/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].RunMesinPercentage = Math.floor((data.RunMesin/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].RPMPercentage = Math.floor((data.RPM/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].InputBarangPercentage = Math.floor((data.InputBarang/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].OutputBarangPercentage = Math.floor((data.OutputBarang/720)*100).toFixed(1).toString() + '%'
          })
        }
        console.log(this.dataDensity)
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        this.status.message = err.response.data.error
        this.status.code = err.response.data.status
        return err
      }
    },
    async getRebootCounter(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getRebootCounter(params)
        console.log(res)
        this.isLoading = false
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        this.status.message = err.response.data.error
        this.status.code = err.response.data.status
        return err
      }
    },
  }

})