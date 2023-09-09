import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { ref } from 'vue'
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Load the English locale

dayjs.locale('en'); // Set the locale to English

export const useRealtimeDataStore = defineStore('realtimedata', () => {

  const devicesStatus = ref([null])
  const devicesGeneralData = ref({})
  const deviceStatus = ref({
    indicator: ''
  })
  const lastData = ref({})
  const loading = ref(false)
  const status = ref({
    state: null,
    message: null,
    code: null,
  })
  const generalParams = [{ '21': '0' }, { 22: '0' }, { 24: '0' }, { 66: '0' }, { 67: '0' }, { 68: '0' }, { 69: '0' }, { 71: '0' }, { 181: '0' }, { 182: '0' }, { 200: '0' }, { 239: '0' }, { 240: '0' }, { 194: '0' }]

  const getLastData = async (imei, avlId) => {
    try {
      loading.value = true
      const params = ref({
        imei: imei,
        avl: avlId
      })
      const res = await dataAPI.getLast(params.value)
      loading.value = false
      return res
    } catch (err) {
      console.error(err)
      loading.value = false
      return '-'
    }
  }
 
  const getGeneralData = async (imei) => {
    const res = await getLastData(imei, generalParams)
    devicesGeneralData.value.IMEINumber = imei
    devicesGeneralData.value.GSMSignal = res.data.AVLData.find(element => element.AVLId === '21').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '21').data[0].AVLValue
    devicesGeneralData.value.dataMode = res.data.AVLData.find(element => element.AVLId === '22').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '22').data[0].AVLValue
    devicesGeneralData.value.speed = res.data.AVLData.find(element => element.AVLId === '24').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '24').data[0].AVLValue
    devicesGeneralData.value.externalVoltage = res.data.AVLData.find(element => element.AVLId === '66').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '66').data[0].AVLValue
    devicesGeneralData.value.batteryVoltage = res.data.AVLData.find(element => element.AVLId === '67').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '67').data[0].AVLValue
    devicesGeneralData.value.batteryCurrent = res.data.AVLData.find(element => element.AVLId === '68').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '68').data[0].AVLValue
    // devicesGeneralData.value.GNSSStatus = res.data.AVLData.find(element => element.AVLId === '69').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '69').data[0].AVLValue
    if (res.data.AVLData.find(element => element.AVLId === '69').dataCount == 0) {
      devicesGeneralData.value.GNSSStatus = '-'
    } else {
      if (res.data.AVLData.find(element => element.AVLId === '69').data[0].AVLValue == '0') {
        devicesGeneralData.value.GNSSStatus = 'OFF'
      }
      if (res.data.AVLData.find(element => element.AVLId === '69').data[0].AVLValue == '1') {
        devicesGeneralData.value.GNSSStatus = 'ON, FIX'
      }
      if (res.data.AVLData.find(element => element.AVLId === '69').data[0].AVLValue == '2') {
        devicesGeneralData.value.GNSSStatus = 'ON, NOT FIX'
      }
      if (res.data.AVLData.find(element => element.AVLId === '69').data[0].AVLValue == '3') {
        devicesGeneralData.value.GNSSStatus = 'SLEEP'
      }
    }

    devicesGeneralData.value.GNSSPDOP = res.data.AVLData.find(element => element.AVLId === '181').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '181').data[0].AVLValue
    devicesGeneralData.value.GNSSHDOP = res.data.AVLData.find(element => element.AVLId === '182').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '182').data[0].AVLValue
    devicesGeneralData.value.sleepMode = res.data.AVLData.find(element => element.AVLId === '200').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '200').data[0].AVLValue
    devicesGeneralData.value.ignition = res.data.AVLData.find(element => element.AVLId === '239').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '239').data[0].AVLValue
    devicesGeneralData.value.movement = res.data.AVLData.find(element => element.AVLId === '240').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '240').data[0].AVLValue
    devicesGeneralData.value.satellites = res.data.AVLData.find(element => element.AVLId === '21').dataCount === 0 ? '-' : res.data.AVLData.find(element => element.AVLId === '21').data[0].satellites
    devicesGeneralData.value.timestamp = res.data.AVLData.find(element => element.AVLId === '194').dataCount === 0 ? '-' : new Date(res.data.AVLData.find(element => element.AVLId === '194').data[0].AVLValue *1000)
  }
  

  const getGSMSignal = async (imei) => {
    const res = await getLastData(imei, [{ 21:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getDataMode = async (imei) => {
    const res = await getLastData(imei, [{ 22:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getSpeed = async (imei) => {
    const res = await getLastData(imei, [{ 24:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getExternalVoltage = async (imei) => {
    const res = await getLastData(imei, [{ 66:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getBatteryVoltage = async (imei) => {
    const res = await getLastData(imei, [{ 67:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getBatteryCurrent = async (imei) => {
    const res = await getLastData(imei, [{ 68:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getGNSSStatus = async (imei) => {
    const res = await getLastData(imei, [{ 71:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getGNSSPDOP = async (imei) => {
    const res = await getLastData(imei, [{ 181:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getGNSSHDOP = async (imei) => {
    const res = await getLastData(imei, [{ 182:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : res.data.AVLData[0].data.ioValue
  }
  const getSleepMode = async (imei) => {
    const res = await getLastData(imei, [{ 200:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : Boolean(res.data.AVLData[0].data.ioValue)
  }
  const getIgnition = async (imei) => {
    const res = await getLastData(imei, [{ 239:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : Boolean(res.data.AVLData[0].data.ioValue)
  }
  const getMovement = async (imei) => {
    const res = await getLastData(imei, [{ 240:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : Boolean(res.data.AVLData[0].data.ioValue)
  }
  const getTimestamp = async (imei) => {
    const res = await getLastData(imei, [{ 194:'0' }])
    return res.data.AVLData[0].dataCount === 0 ? '-' : new Date(res.data.AVLData[0].data.ioValue*1000)
  }

  const getDevicesStatus = async () => {
    loading.value = true
    try {
      const res = await dataAPI.getDevicesStatus()
      console.log(res.data)
      devicesStatus.value = res.data
      devicesStatus.value.map((data) => {
        data.lastHandshake = dayjs(data._time).format('M/D/YY [at] h:mmA')
        switch (data.status) {
          case 'OFFLINE':
            data.indicator = 0
            break;
          case 'ONLINE':
            data.indicator = 1
            break;
          default:
            data.indicator = 0
            break;
        }
      })
      loading.value = false
    } catch (err) {
      console.error(err)
      loading.value = false
      return err
    }
  }

  const getDeviceStatus = async (imei) => {
    loading.value = true
    try {
      const res = await dataAPI.getDeviceStatus(imei)
      deviceStatus.value = res.data

      deviceStatus.value.lastHandshake = dayjs(deviceStatus.value._time).format('M/D/YY [at] h:mmA')
      switch (deviceStatus.value.status) {
        case 'OFFLINE':
          deviceStatus.value.indicator = 0
          break;
        case 'ONLINE':
          deviceStatus.value.indicator = 1
          break;
        default:
          deviceStatus.value.indicator = 0
          break;
      }

      loading.value = false
    } catch (err) {
      console.error(err)
      loading.value = false
      return err
    }
  }

  return {
    lastData,
    loading,
    status,
    devicesStatus,
    deviceStatus,
    devicesGeneralData,
    getGSMSignal,
    getDataMode,
    getSpeed,
    getExternalVoltage,
    getBatteryVoltage,
    getBatteryCurrent,
    getGNSSStatus,
    getGNSSPDOP,
    getGNSSHDOP,
    getSleepMode,
    getIgnition,
    getMovement,
    getTimestamp,
    getDevicesStatus,
    getDeviceStatus,
    getGeneralData,
  }
})