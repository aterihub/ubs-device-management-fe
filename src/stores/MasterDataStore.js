import { defineStore } from 'pinia'
import masterDataAPI from '@/services/masterDataAPI'
import { ref } from 'vue'
import { useLocalStorage } from "@vueuse/core"

export const useMasterDataStore = defineStore('master', {
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
    floors: useLocalStorage('floors', []),
    trays: useLocalStorage('trays', []),
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
    async getAirioFloors() {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getAirioFloors()
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
    async getAirioTrays(floor) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getAirioTrays(floor)
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
        this.devices = []
        res.data.data.map((data) => {
          this.devices.push({machine_name: data._value, PowerMachine: true, RunMachine: true, RPM: true, InputBarang: true, OutputBarang: true})
        })
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.error(err)
        return err
      }
    },
    async getAirioDevices(tray) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getAirioDevices(tray)
        this.devices = []
        res.data.data.map((data) => {
          const { machine_name } = this.airioMachineName.find((x) => {
            return x.device_id == data._value
          })
          this.devices.push({device_id: data._value, machine_name: machine_name, RunMachine: true, RPM: true, InputBarang: true, OutputBarang: true})
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
