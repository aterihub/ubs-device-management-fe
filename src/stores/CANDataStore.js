import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { ref } from 'vue'
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Load the English locale

dayjs.locale('en'); // Set the locale to English

export const useCANDataStore = defineStore('candata', () => {
  
  const devicesCANData = ref([])
  
  const loading = ref(false)
  const status = ref({
    state:null,
    message: null,
    code: null, 
  })
  
  const getCANDatas = async (imei, avlParams) => {
    loading.value = true
    const params = ref({ 
      imei: imei,
      avl: avlParams,
      enableDecode:true,
      maskingBit:'65535',
    })
    try {
      const res = await dataAPI.getLast(params.value)
      console.log(res)
      loading.value = false
      return res.data.AVLData
      // return res.data.AVLData[0].dataCount !== 0 ? res.data.AVLData[0].data[0].AVLValue : 'No Data'
    } catch (err) {
      console.error(err)
      loading.value = false
      return '-'
    }
  }


    
  // const getCANDatas = async (imei, avlId, dataId) => {
  //   loading.value = true
  //   const params = ref({
  //     imei:imei,
  //     avlId:avlId,
  //     enableDecode:true,
  //     maskingBit:'65535',
  //     dataId: dataId
  //   })
  //   for (let index = 0; index < 12; index++) {
  //     console.log(CANDatas.value)
  //     params.value.dataId = dataId[index]
  //     try {
  //       const res = await dataAPI.getLast(params.value)
  //       CANDatas.value[index].dataID = res.data.dataId
  //       CANDatas.value[index].dataValue =  res.data.data.decodedData
  //       loading.value = false
  //       return res
  //     } catch (err) { 
  //       console.error(err)
  //       CANDatas.value[index].dataID = '-'
  //       CANDatas.value[index].dataValue = 'No Data'
  //       loading.value = false
  //       return err
  //     } 
  //   }
  // }

  
  const getGSMSignal = async (imei) => {
    const res = await getLastData(imei,'21')
    lastData.value.GSMSignal = res.data.data.length === 0 ? 'no data' : res.data.data[0].AVLValue
  } 
  

  return {
    devicesCANData,
    loading,
    status,
    getCANDatas,
  }
})