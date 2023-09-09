import { defineStore } from 'pinia'
import masterDataAPI from '@/services/masterDataAPI'
import { ref } from 'vue'

export const useMasterDataStore = defineStore('master', {
  state: () => ({
    floors: ref([]),
    trays: ref([]),
    devices: ref([]),
    isLoading: ref(false),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    })
  }),

  actions: {
    async getFloors() {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getFloors()
        console.log(res)
        this.floors = []
        res.data.data.map((data) => {
          this.floors.push(data._value)
        })
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.error(err)
        return err
      }
    },
    async getTrays(floor) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getTrays(floor)
        console.log(res)
        this.trays = []
        res.data.data.map((data) => {
          this.trays.push(data._value)
        })
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.error(err)
        return err
      }
    },
    async getDevices(tray) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getDevices(tray)
        console.log(res)
        this.devices = []
        res.data.data.map((data) => {
          this.devices.push(data._value)
        })
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.error(err)
        return err
      }
    },
  }
})
