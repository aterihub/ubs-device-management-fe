<template>
<sideNav :isDevicesActive="true" />
<div class="content">
  <div class="content-header">
    <h1 class="title"> Device Information </h1>
    <div class="button-wrapper">
      <Button type="button" class="filled__blue" label="Edit Information" />
    </div>
  </div>
  <div class="device-info-wrapper flex flex-col sm:flex-row w-full h-fit gap-10 justify-between">
    <div class="device-info bg-[#F7F7F7] rounded-lg w-full py-5 px-10 flex flex-col sm:flex-row gap-3 sm:justify-between">
      <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">Device Name:</p>
          <p class="text-[#353535] text-base">{{ deviceData.name }}</p>
        </div>
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">Device Type:</p>
          <p class="text-[#353535] text-base">{{ deviceData.name }}</p>
        </div>
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">IMEI Number:</p>
          <p class="text-[#353535] text-base">{{ deviceData.imei }}</p>
        </div>
      </div>
      <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">Status:</p>
          <div class="flex items-center gap-3">
            <Indicator :status="deviceData.indicator"/>
            <p class="text-[#353535] text-base">{{ deviceData.status }}</p>
          </div>
        </div>
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">IP Address:</p>
          <p class="text-[#353535] text-base">{{ deviceData.ipAddress }}</p>
        </div>
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">Port:</p>
          <p class="text-[#353535] text-base">{{ deviceData.port }}</p>
        </div>
      </div>
      <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">SIM Number:</p>
          <p class="text-[#353535] text-base">{{ deviceData.name }}</p>
        </div>
        <div class="text-wrapper flex flex-col gap-2 text-left">
          <p class="text-[#353535]/60 text-sm">SIM Information:</p>
          <p class="text-[#353535] text-base">{{ deviceData.name }}</p>
        </div>
      </div>
    </div>
    <div class="device-notes bg-[#F7F7F7] rounded-lg h-[280px] w-[300px] sm:w-[480px] py-5 px-10">
      <div class="text-wrapper flex flex-col gap-2 text-left">
        <p class="text-[#353535]/60 text-sm">Notes:</p>
        <p class="text-[#353535] text-base">{{ deviceData.name }}</p>
      </div>
    </div>
  </div>
  <div class="table-wrap">
    <EasyDataTable
    table-class-name="customize-table"
    :headers="header"
    :items="[deviceData]"
    theme-color="#1363df"        
    />
  </div>
</div>
</template>
     
<script setup>
import DeviceInfo from '@/views/Devices/DeviceInfo.vue'
import EditDevice from '@/views/Devices/EditDevice.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import Button from '@/components/button/BaseButton.vue'
import { useDevicesStore } from '@/stores/DevicesStore'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue';

  const props = defineProps({
    id: String
  })
  const header = [
    { text: "", value: "indicator", width: 40},
    { text: "IMEI", value: "imei" },
    { text: "Device Name", value: "name", sortable: true },
    { text: "Status", value: "status", sortable: true },
    { text: "IP Address", value: "ipAddress", sortable: true },
    { text: "Port", value: "port", sortable: true },
    { text: "Last Handshake", value: "lastHandshake", sortable: true },
    { text: "", value: "operation", width: 100 },
  ]
  
  const devicesStore = useDevicesStore()
  const { deviceData } = storeToRefs(useDevicesStore())
  
  const selectedComponent = ref('DeviceInfo')

  onBeforeMount( async () => {
    await devicesStore.loadDevice(props.id)
    console.log(deviceData.value)
      switch (deviceData.value.status) {
        case 0:
          deviceData.value.status = 'Offline'
          deviceData.value.indicator = 0
        break;
        case 1:
          deviceData.value.status = 'Online'
          deviceData.value.indicator = 1
        break;
        default:
          break;
      }
  })

  
</script>
    
  <style scoped>
.content {
  @apply w-full h-fit px-5 py-[32px] ml-[60px] pt-[46px]
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