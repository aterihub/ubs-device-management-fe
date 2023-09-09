import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { ref } from 'vue'

export const useGeoDataStore = defineStore('geo', {
  state: () => ({
    deviceGeo: ref({
      altitude: null,
      angle: null,
      external_power: null,
      fix_flag: null,
      gsm_signal: null,
      hdop: null,
      internal_battery: null,
      latitude: null,
      longitude: null,
      result: null,
      satellites: null,
      speed: null
    }),
    deviceHistoryGeo: ref([{
      altitude: null,
      angle: null,
      external_power: null,
      fix_flag: null,
      gsm_signal: null,
      hdop: null,
      internal_battery: null,
      latitude: null,
      longitude: null,
      result: null,
      satellites: null,
      speed: null
    }]),
    vehicleLastGeo: ref({
      lastData: {
        altitude: null,
        angle: null,
        external_power: null,
        fix_flag: null,
        gsm_signal: null,
        hdop: null,
        internal_battery: null,
        latitude: null,
        longitude: null,
        result: null,
        satellites: null,
        speed: null
      }
    }),
    vehicleHistoryGeo: ref([{
      lastData: {
        altitude: null,
        angle: null,
        external_power: null,
        fix_flag: null,
        gsm_signal: null,
        hdop: null,
        internal_battery: null,
        latitude: null,
        longitude: null,
        result: null,
        satellites: null,
        speed: null
      }
    }]),
    isLoading: ref(false),
    status: ref({
      state:null,
      message: null,
      code: null,
    })
  }),

  actions: {
    async getLastDeviceGeo(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getLastDeviceGeo(params)
        this.deviceGeo = res.data
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async getHistoryDeviceGeo(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getHistoryDeviceGeo(params)
        this.deviceHistoryGeo = res.data
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async getVehicleLastDeviceGeo(id) {
      this.isLoading = true
      try {
        const res = await dataAPI.getVehicleLastDeviceGeo(id)
        this.vehicleLastGeo = res.data
        res.data.devices.map((data, index) => {
          let radius = parseFloat(data.lastData.hdop) * 2.5
          let diameter = radius * 2
          this.vehicleLastGeo.devices[index].lastData.radius = diameter
          this.vehicleLastGeo.devices[index].lastData._time = new Date(data.lastData._time).toLocaleString()
          this.vehicleLastGeo.devices[index].lastData.stored_time = new Date(data.lastData.stored_time).toLocaleString()
        })
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async getVehicleHistoryDeviceGeo(id,params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getVehicleHistoryDeviceGeo(id,params)
        res.data.devices.map((data) => {
          if (data.variant.manufacturer.name === 'Istartek') {
            data.historyData.map((data) => {
              let gsm_signal = Math.floor((data.gsm_signal/31)*5)
              data.gsm_signal = gsm_signal
              // console.log(gsm_signal)
            })
          }
          if (data.variant.manufacturer.name === 'Teltonika') {
            data.historyData.map((data) => {
              let gsm_signal = Math.floor(data.gsm_signal)
              data.gsm_signal = gsm_signal
              // console.log(gsm_signal)
            })
          }
          
          data.historyData.map((data) => {
            let radius = parseFloat(data.hdop) * 2.5
            let diameter = radius * 2
            data.radius = diameter
            let unix_stored_time = Math.floor(new Date(data.stored_time).getTime() / 1000)
            let unix_time = Math.floor(new Date(data._time).getTime() / 1000)
            data.diff_time = Math.abs(unix_stored_time - unix_time)
            data._time = new Date(data._time).toLocaleString()
            data.stored_time = new Date(data.stored_time).toLocaleString()
          })
        })

        this.vehicleHistoryGeo = res.data
        this.isLoading = false
        this.status.isError = false
        this.status.message ='Route Fetched'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    }
  }
})
