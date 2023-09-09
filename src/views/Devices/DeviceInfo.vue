<template>
<div class="device-info-wrapper flex flex-col sm:flex-row w-full h-fit gap-10 justify-between">
  <div class="device-info bg-[#F7F7F7] rounded-lg w-full py-5 px-10 flex flex-col sm:flex-row gap-3 sm:justify-between">
    <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">Device Name:</p>
        <p class="text-[#353535] text-base">{{ mergedData.deviceName }}</p>
      </div>
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">Device Type:</p>
        <p class="text-[#353535] text-base">{{ mergedData.deviceType }}</p>
      </div>
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">IMEI Number:</p>
        <p class="text-[#353535] text-base">{{ mergedData.IMEINumber }}</p>
      </div>
    </div>
    <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">Status:</p>
        <div class="flex items-center gap-3">
          <Indicator :status="mergedData.indicator"/>
          <p class="text-[#353535] text-base">{{ mergedData.status }}</p>
        </div>
      </div>
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">IP Address:</p>
        <p class="text-[#353535] text-base">{{ mergedData.IPAddress }}</p>
      </div>
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">Port:</p>
        <p class="text-[#353535] text-base">{{ mergedData.port }}</p>
      </div>
    </div>
    <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">SIM Number:</p>
        <p class="text-[#353535] text-base">{{ mergedData.SIMNumber }}</p>
      </div>
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">SIM Information:</p>
        <p class="text-[#353535] text-base">{{ mergedData.SIMInfo }}</p>
      </div>
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">Last Handshake:</p>
        <p class="text-[#353535] text-base">{{ mergedData.lastHandshake }}</p>
      </div>
    </div>
  </div>
  <div class="device-notes bg-[#F7F7F7] rounded-lg h-[280px] w-[300px] sm:w-[1000px] py-5 px-10">
    <div class="text-wrapper flex flex-col gap-2 text-left">
      <p class="text-[#353535]/60 text-sm">Notes:</p>
      <p class="text-[#353535] text-base">{{ mergedData.notes }}</p>
    </div>
  </div>
</div>
</template>
     
<script setup>

import Indicator from '@/components/Indicator.vue'
import { useRealtimeDataStore } from '@/stores/RealtimeDataStore'
import { storeToRefs } from 'pinia'
import { useDevicesStore } from '@/stores/DevicesStore'
import { ref, onUnmounted, onBeforeMount } from 'vue';

  const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
  const realtimeDataStore = useRealtimeDataStore()
  const { deviceStatus } = storeToRefs(useRealtimeDataStore())
  const devicesStore = useDevicesStore()
  const { deviceData } = storeToRefs(useDevicesStore())

  const mergedData = ref({}) 

  async function getDevicesList() {
    await realtimeDataStore.getDeviceStatus(props.id)
    mergedData.value = Object.assign({}, deviceData.value, deviceStatus.value);
    console.log(mergedData.value)
  }


  const delay = require('delay')
  const whileState = ref(true)
  const loading = ref(false)
  
  onBeforeMount( async () => {
  loading.value = true
  await devicesStore.loadDevice(props.id)
  await getDevicesList()
  loading.value = false
  while (whileState.value) {
    await getDevicesList() 
    await delay(10000)
  }
})

  onUnmounted( async () => {
    whileState.value = false
  })


  
</script>
    
  <style scoped>
.content {
  @apply w-full h-fit px-5 py-[32px] pt-[46px]
}
  .title {
    @apply
      text-[28px] font-normal flex justify-start items-center text-[#353535] opacity-80
  }
  .table-wrap {
    @apply
      h-[300px] py-[15px] mt-[5px]
      overflow-auto sm:overflow-visible
  }
  .content-header {
    @apply
    flex flex-row w-full justify-between mb-[30px]
  }
  
  .customize-table {
    cursor: pointer;
    --easy-table-header-font-size: 14px;
    --easy-table-header-background-color: #F7F7F7;
    --easy-table-header-font-color:	#3A3A3E;
    /* --easy-table-row-border:	1px solid #D2DDEE; */
    --easy-table-header-height:	40px;
  
    --easy-table-body-row-font-size:	14px;
    --easy-table-body-font-color:	#3A3A3E;
    --easy-table-body-row-height:	46px;
  
    --easy-table-footer-font-size:	12px;
    --easy-table-footer-height:	40px;
    --easy-table-footer-font-color:	#3A3A3E;
  }
    </style>