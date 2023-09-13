import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { computed, ref } from 'vue'
import { useLocalStorage } from "@vueuse/core"
import pivotArray from '../composable/pivotArray'

export const useDataStore = defineStore('data', {
  state: () => ({
    servicesStatus: ref({}),
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
    rebootDetail: ref([]),
    dataDensity: ref([]),
    airioRebootCounter: ref('-'),
    airioMissingData: ref([]),
    airioDuplicateData: ref([]),
    airioRebootDetail: ref([]),
    airioDataDensity: ref([]),
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
            this.dataDensity[index].PowerMesin = data.PowerMesin == undefined ? '-' : data.PowerMesin + ' (' + ((data.RunMesin/720)*100).toFixed(1) + '%' + ')'
            this.dataDensity[index].RunMesin = data.RunMesin == undefined ? '-' : data.RunMesin + ' (' + ((data.RunMesin/720)*100).toFixed(1) + '%' + ')'
            this.dataDensity[index].RPM = data.RPM == undefined ? '-' : data.RPM + ' (' + ((data.RPM/720)*100).toFixed(1) + '%' + ')'
            this.dataDensity[index].InputBarang = data.InputBarang == undefined ? '-' : data.InputBarang + ' (' + ((data.InputBarang/720)*100).toFixed(1) + '%' + ')'
            this.dataDensity[index].OutputBarang = data.OutputBarang == undefined ? '-' : data.OutputBarang + ' (' + ((data.OutputBarang/720)*100).toFixed(1) + '%' + ')'
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
        this.airioDataDensity = res.data.data
        if (this.airioDataDensity.length != 0) {
          this.airioDataDensity.map((data, index) => {
            this.airioDataDensity[index]._time = new Date(data._time).toLocaleString()
            this.airioDataDensity[index].RunMesin = data.RunMesin == undefined ? '-' : data.RunMesin + ' (' + ((data.RunMesin/720)*100).toFixed(1) + '%' + ')'
            this.airioDataDensity[index].RPM = data.RPM == undefined ? '-' : data.RPM + ' (' + ((data.RPM/720)*100).toFixed(1) + '%' + ')'
            this.airioDataDensity[index].InputBarang = data.InputBarang == undefined ? '-' : data.InputBarang + ' (' + ((data.InputBarang/720)*100).toFixed(1) + '%' + ')'
            this.airioDataDensity[index].OutputBarang = data.OutputBarang == undefined ? '-' : data.OutputBarang + ' (' + ((data.OutputBarang/720)*100).toFixed(1) + '%' + ')'
          })
        }
        console.log(this.airioDataDensity)
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
        this.airioRebootCounter = res.data.data.count
        res.data.data.detail.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
        })
        this.airioRebootDetail = res.data.data.detail
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
        this.duplicateData = pivotArray.pivotArray(res.data.data)
        this.duplicateData.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data.powerMesin = data.powerMesin + ' (' + ((data.powerMesin/720)*100).toFixed(1) + '%' + ')'
          data.runMesin = data.runMesin + ' (' + ((data.runMesin/720)*100).toFixed(1) + '%' + ')'
          data.rpm = data.rpm + ' (' + ((data.rpm/720)*100).toFixed(1) + '%' + ')'
          data.inputBarang = data.inputBarang + ' (' + ((data.inputBarang/720)*100).toFixed(1) + '%' + ')'
          data.outputBarang = data.outputBarang + ' (' + ((data.outputBarang/720)*100).toFixed(1) + '%' + ')'
        })
        console.log('duplicateData',this.duplicateData)

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
        // res.data.data.runMesin.forEach((data) => {
        //   data._time = new Date (data._time).toLocaleString()
        //   data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        // })
        // res.data.data.rpm.forEach((data) => {
        //   data._time = new Date (data._time).toLocaleString()
        //   data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        // })
        // res.data.data.inputBarang.forEach((data) => {
        //   data._time = new Date (data._time).toLocaleString()
        //   data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        // })
        // res.data.data.outputBarang.forEach((data) => {
        //   data._time = new Date (data._time).toLocaleString()
        //   data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        // })
        this.airioDuplicateData = pivotArray.airioPivotArray(res.data.data)
        this.airioDuplicateData.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data.runMesin = data.runMesin + ' (' + ((data.runMesin/720)*100).toFixed(1) + '%' + ')'
          data.rpm = data.rpm + ' (' + ((data.rpm/720)*100).toFixed(1) + '%' + ')'
          data.inputBarang = data.inputBarang + ' (' + ((data.inputBarang/720)*100).toFixed(1) + '%' + ')'
          data.outputBarang = data.outputBarang + ' (' + ((data.outputBarang/720)*100).toFixed(1) + '%' + ')'
        })
        console.log('dulpicate data', this.airioDuplicateData)
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
    async getAirioMissingData(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getAirioMissingData(params)
        res.data.data.runMesin.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        })
        res.data.data.rpm.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        })
        res.data.data.inputBarang.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        })
        res.data.data.outputBarang.forEach((data) => {
          data._time = new Date (data._time).toLocaleString()
          data._value = data._value + ' (' + ((data._value/720)*100).toFixed(1) + '%' + ')'
        })
        this.airioMissingData = pivotArray.airioPivotArray(res.data.data)
        console.log(this.airioMissingData)
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
    async getServiceStatus() {
      this.isLoading = true
      try {
        const res = await dataAPI.getServiceStatus()
        this.servicesStatus = res.data.data
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