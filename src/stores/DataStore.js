import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { computed, ref } from 'vue'
import { useLocalStorage } from "@vueuse/core"

export const useDataStore = defineStore('data', {
  state: () => ({
    rebootCounter: ref('-'),
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
    setData(data) {
      this.checkbox = data
    },
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
            this.offlineDevices[index].message = 'MQTT not connected'
            this.offlineDevices[index].uptime = data.uptime/60
            this.offlineDevices[index].last_heard = new Date(data.last_heard).toLocaleString()
          })
        }
        this.onlineDevices = this.realtimeData.filter(data => data.status == 'ONLINE')
        if (this.onlineDevices.length != 0) {
          this.onlineDevices.map((data,index) => {
            this.onlineDevices[index].uptime = data.uptime/60
            this.offlineDevices[index].last_heard = new Date(data.last_heard).toLocaleString()
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
            this.dataDensity[index].PowerMesin = data.PowerMesin == undefined ? '-' : data.PowerMesin
            this.dataDensity[index].RunMesin = data.RunMesin == undefined ? '-' : data.RunMesin
            this.dataDensity[index].RPM = data.RPM == undefined ? '-' : data.RPM
            this.dataDensity[index].InputBarang = data.InputBarang == undefined ? '-' : data.InputBarang
            this.dataDensity[index].OutputBarang = data.OutputBarang == undefined ? '-' : data.OutputBarang
            this.dataDensity[index].PowerMesinPercentage = data.PowerMesin == '-' ? '0%' : Math.floor((data.PowerMesin/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].RunMesinPercentage = data.RunMesin == '-' ? '0%' : Math.floor((data.RunMesin/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].RPMPercentage = data.RPM == '-' ? '0%' : Math.floor((data.RPM/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].InputBarangPercentage = data.InputBarang == '-' ? '0%' : Math.floor((data.InputBarang/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].OutputBarangPercentage = data.OutputBarang == '-' ? '0%' : Math.floor((data.OutputBarang/720)*100).toFixed(1).toString() + '%'
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
        console.log(res.data.data)
        // res.data.data.map((data) => {
        //   this.rebootCounter = data._value
        // })
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