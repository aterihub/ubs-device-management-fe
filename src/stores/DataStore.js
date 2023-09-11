import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { computed, ref } from 'vue'
import { useLocalStorage } from "@vueuse/core"

export const useDataStore = defineStore('data', {
  state: () => ({
    airioMachineName: [
      { machine_name: 'R824', device_id: '5443B2A939F8' },
      { machine_name: 'R820', device_id: '5443B2A93A90' },
      { machine_name: 'R819', device_id: 'C8C9A3CB32C8' },
      { machine_name: 'R825', device_id: 'C8C9A3CB8AB0' },
      { machine_name: 'R954', device_id: '5443B2A93EA4' },
      { machine_name: 'R823', device_id: 'C8C9A3C863C8' },
      { machine_name: 'R668', device_id: '78E36D1921A8' },
      { machine_name: 'R916', device_id: 'C8C9A3CA4FFC' },
      { machine_name: 'R108', device_id: '5443B2A93C70' },
      { machine_name: 'R827', device_id: 'C8C9A3CAA19C' },
      { machine_name: 'R86', device_id: 'C8C9A3C87274' },
      { machine_name: 'R826', device_id: 'C8C9A3CC371C' }
    ],
    rebootCounter: ref('-'),
    duplicateData: ref([]),
    rpmDuplicate: ref([]),
    runMesinDuplicate: ref([]),
    inputBarangDuplicate: ref([]),
    outputBarangDuplicate: ref([]),
    rebootDetail: ref([]),
    dataDensity: ref([]),
    realtimeData: ref([]),
    offlineDevices: ref([]),
    onlineDevices: ref([]),
    realtimeDevicesStatus: ref({}),
    status: ref({
      isError: null,
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
          this.offlineDevices.map((data, index) => {
            this.offlineDevices[index].message = 'MQTT not connected'
            this.offlineDevices[index].uptime = data.uptime / 60
            this.offlineDevices[index].last_heard = new Date(data.last_heard).toLocaleString()
          })
        }
        this.onlineDevices = this.realtimeData.filter(data => data.status == 'ONLINE')
        if (this.onlineDevices.length != 0) {
          this.onlineDevices.map((data, index) => {
            this.onlineDevices[index].uptime = data.uptime / 60
            this.onlineDevices[index].last_heard = new Date(data.last_heard).toLocaleString()
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
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
    async getAirioRealtimeData(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getAirioRealtimeData(params)
        this.realtimeDevicesStatus = res.data.data.counter
        this.realtimeData = res.data.data.data
        this.offlineDevices = this.realtimeData.filter(data => data.status == 'OFFLINE')
        if (this.offlineDevices.length != 0) {
          this.offlineDevices.forEach((data) => {
            const { machine_name } = this.airioMachineName.find((x) => {
              return x.device_id == data.device_id
            })
            data.machine_name = machine_name
            data.message = 'MQTT not connected'
            data.uptime = data.uptime / 60
            data.last_heard = new Date(data.last_heard).toLocaleString()
          })
        }
        this.onlineDevices = this.realtimeData.filter(data => data.status == 'ONLINE')
        if (this.onlineDevices.length != 0) {
          this.onlineDevices.forEach((data) => {
            const { machine_name } = this.airioMachineName.find((x) => {
              return x.device_id == data.device_id
            })
            data.machine_name = machine_name
            data.uptime = data.uptime / 60
            data.last_heard = new Date(data.last_heard).toLocaleString()
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
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
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
          this.dataDensity.map((data, index) => {
            this.dataDensity[index]._time = new Date(data._time).toLocaleString()
            this.dataDensity[index].PowerMesin = data.PowerMesin == undefined ? '-' : data.PowerMesin
            this.dataDensity[index].RunMesin = data.RunMesin == undefined ? '-' : data.RunMesin
            this.dataDensity[index].RPM = data.RPM == undefined ? '-' : data.RPM
            this.dataDensity[index].InputBarang = data.InputBarang == undefined ? '-' : data.InputBarang
            this.dataDensity[index].OutputBarang = data.OutputBarang == undefined ? '-' : data.OutputBarang
            this.dataDensity[index].PowerMesinPercentage = data.PowerMesin == '-' ? '0%' : ((data.PowerMesin / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].RunMesinPercentage = data.RunMesin == '-' ? '0%' : ((data.RunMesin / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].RPMPercentage = data.RPM == '-' ? '0%' : ((data.RPM / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].InputBarangPercentage = data.InputBarang == '-' ? '0%' : ((data.InputBarang / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].OutputBarangPercentage = data.OutputBarang == '-' ? '0%' : ((data.OutputBarang / 720) * 100).toFixed(1).toString() + '%'
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
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
    async getAirioDataDensity(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getAirioDataDensity(params)
        console.log(res)
        this.isLoading = false
        this.dataDensity = res.data.data
        if (this.dataDensity.length != 0) {
          this.dataDensity.map((data, index) => {
            this.dataDensity[index]._time = new Date(data._time).toLocaleString()
            // this.dataDensity[index].PowerMesin = data.PowerMesin == undefined ? '-' : data.PowerMesin
            this.dataDensity[index].RunMesin = data.RunMesin == undefined ? '-' : data.RunMesin
            this.dataDensity[index].RPM = data.RPM == undefined ? '-' : data.RPM
            this.dataDensity[index].InputBarang = data.InputBarang == undefined ? '-' : data.InputBarang
            this.dataDensity[index].OutputBarang = data.OutputBarang == undefined ? '-' : data.OutputBarang
            // this.dataDensity[index].PowerMesinPercentage = data.PowerMesin == '-' ? '0%' : Math.floor((data.PowerMesin/720)*100).toFixed(1).toString() + '%'
            this.dataDensity[index].RunMesinPercentage = data.RunMesin == '-' ? '0%' : ((data.RunMesin / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].RPMPercentage = data.RPM == '-' ? '0%' : ((data.RPM / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].InputBarangPercentage = data.InputBarang == '-' ? '0%' : ((data.InputBarang / 720) * 100).toFixed(1).toString() + '%'
            this.dataDensity[index].OutputBarangPercentage = data.OutputBarang == '-' ? '0%' : ((data.OutputBarang / 720) * 100).toFixed(1).toString() + '%'
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
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
    async getRebootCounter(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getRebootCounter(params)
        this.rebootCounter = res.data.data.count
        res.data.data.detail.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
        })
        this.rebootDetail = res.data.data.detail
        this.isLoading = false
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
    async getAirioRebootCounter(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getAirioRebootCounter(params)
        this.rebootCounter = res.data.data.count
        res.data.data.detail.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
        })
        this.rebootDetail = res.data.data.detail
        this.isLoading = false
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
    async getDuplicate(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getDuplicate(params)
        console.log('duplicate',res.data.data)
        res.data.data.runMesin.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        res.data.data.rpm.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        res.data.data.inputBarang.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        res.data.data.outputBarang.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        this.rpmDuplicate = res.data.data.rpm,
        this.runMesinDuplicate = res.data.data.runMesin
        this.inputBarangDuplicate = res.data.data.inputBarang,
        this.outputBarangDuplicate = res.data.data.outputBarang,
        this.isLoading = false
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
    async getAirioDuplicate(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getAirioDuplicate(params)
        console.log('duplicate',res.data.data)
        res.data.data.runMesin.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        res.data.data.rpm.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        res.data.data.inputBarang.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        res.data.data.outputBarang.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value
        })
        this.rpmDuplicate = res.data.data.rpm,
        this.runMesinDuplicate = res.data.data.runMesin
        this.inputBarangDuplicate = res.data.data.inputBarang,
        this.outputBarangDuplicate = res.data.data.outputBarang,
        this.isLoading = false
        this.status.isError = false
        this.status.message = res.data.message
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        // this.status.message = err.response.data.error
        // this.status.code = err.response.data.status
        return err
      }
    },
  }

})