import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { ref } from 'vue'

export const useVehicleStatus = defineStore('vehicleStatus', {
  state: () => ({
    vehicleStatus: ref(),
    isLoading: ref(false),
    status: ref({
      state:null,
      message: null,
      code: null,
    })
  }),
  actions: {
    async getLastVehicleStatus(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getLastVehicleStatus(params)
        this.vehicleStatus = res.data
        this.vehicleStatus.devices.map((data, index) => {
            switch (data.tcpstatus.status) {
              case 'OFFLINE':
                this.vehicleStatus.devices[index].tcpstatus.indicator = 0
                break;
              case 'ONLINE':
                this.vehicleStatus.devices[index].tcpstatus.indicator = 1
                break;
              default:
                this.vehicleStatus.devices[index].tcpstatus.indicator = 0
                break;
            }
        })
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    }
  }
})
