import { defineStore } from 'pinia'
import devicesApi from '@/services/deviceAPI'
import { ref } from 'vue'

export const useDevicesStore = defineStore('device', () => {

  const devicesList = ref([])
  const deviceData = ref([])
  const createDeviceIsLoading = ref()
  const updateDeviceIsLoading = ref()
  const isLoading = ref(false)
  const status = ref({
    message: null,
    code: null,
    state: null
  })

  const loadDevices = async () => {
    isLoading.value = true
    try {
      const res = await devicesApi.getDevices()
      devicesList.value = res.data
      console.log(devicesList.value)
      isLoading.value = false
    } catch (err) {
        console.error(err)
        isLoading.value = false
      return err
    } 
  }

  const loadDevice = async (id) => {
    isLoading.value = true
    try {
      const res = await devicesApi.getDevice(id)
      deviceData.value = res.data
      isLoading.value = false
    } catch (err) {
      console.error(err)
      isLoading.value = false
      return err
    } 
  }

  const createDevices = async (deviceData) => {
    createDeviceIsLoading.value = true
    try {
      const res = await devicesApi.createDevices(deviceData)
      console.log(res)
      status.value.message = 'Device Created'
      status.value.code = res.data.status
      status.value.state = false
      createDeviceIsLoading.value = false
    } catch (err) {
      console.error(err)
      status.value.state = true
      status.value.message = err.response.data.message
      status.value.code = err.response.data.statusCode
      createDeviceIsLoading.value = false
      return err
    } 
  }

  const updateDevice = async (id,deviceData) => {
    updateDeviceIsLoading.value = true
    try {
      const res = await devicesApi.updateDevice(id,deviceData)
      console.log(res)
      status.value.message = 'Device Updated'
      status.value.code = res.data.status
      updateDeviceIsLoading.value = false
      status.value.state = false
    } catch (err) {
      console.error(err)
      status.value.state = true
      status.value.message = err.response.data.error 
      status.value.code = err.response.data.statusCode
      updateDeviceIsLoading.value = false
      return err
    } 
  }

  const deleteDevice = async (id) => {
    isLoading.value = true
    try {
      const res = await devicesApi.deleteDevice(id)
      status.value.message = 'Device Deleted'
      status.value.code = res.data.status
      isLoading.value = false
      console.log(res)
    } catch (err) {
      console.error(err)
      isLoading.value = false
      return err
    } 
  }
 
  return {
    devicesList, isLoading, loadDevices, createDevices, deleteDevice, status, loadDevice, deviceData, createDeviceIsLoading,updateDeviceIsLoading, updateDevice
  }
})