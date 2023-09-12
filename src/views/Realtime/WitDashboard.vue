<template>

  <alert 
    :message ="alertMessage"
    :modalActive="modalActive"
    :isError="isError"
    @close="closeNotification" />
  <sideNav :isRealtimeActive="true" />
  <div class="content">
    <div class="device-container">
      <h1 class="title">Realtime Dashboard</h1>
        <!-- <lazyCard v-if="loading" v-for="card in 4" /> -->
      <div class="flex justify-between">
        <form @submit.prevent="filterRealtimeData" class="grid grid-cols-5 max-w-2xl gap-4">
          <select v-model="selectedFloor" class="select-option col-span-2">
            <option value="0" selected>Select Floor</option>
            <option v-for="item in floors" :key="item" :value="item">
              <p class="font-semibold">{{ item }}</p>
            </option>
          </select>
          <select v-model="selectedAirioTray" class="select-option col-span-2">
            <option value="TrayG" selected>Tray G</option>
          </select>
        </form>
        <h1>Last Update: <span class="pl-2 font-semibold">{{ lastUpdate }}</span></h1>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 w-full gap-10">
        <div class="card border border-[#57C09B] col-span-3" >
          <div class="mb-10 gap-2 flex flex-col">
            <h1 class="font-bold text-3xl">{{realtimeDevicesStatus.online}}/{{realtimeDevicesStatus.total}}</h1>
            <h2 class="text-xl">Online Devices</h2>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 w-full gap-2">
            <div class="flex flex-col justify-between gap-2 border-l-4  border-[#57C09B] px-4 py-2 w-full">
              <p class="text-xs md:text-sm lg:text-base">Normal</p>
              <p class="text-xs md:text-sm lg:text-base font-semibold">{{realtimeDevicesStatus.normal}} machines</p>
            </div>
            <div class="flex flex-col justify-between gap-2 border-l-4  border-[#5DA3EE] px-4 py-2 w-full">
              <p class="text-xs md:text-sm lg:text-base">Idle</p>
              <p class="text-xs md:text-sm lg:text-base font-semibold">{{realtimeDevicesStatus.idle}} machines</p>
            </div>
            <div class="flex flex-col justify-between gap-2 border-l-4  border-[#E63946] px-4 py-2 w-full">
              <p class="text-xs md:text-sm lg:text-base">Sensor Broken</p>
              <p class="text-xs md:text-sm lg:text-base font-semibold">{{realtimeDevicesStatus.faultySensors}} machines</p>
            </div>
            <div class="flex flex-col justify-between gap-2 border-l-4  border-[#E63946] px-4 py-2 w-full">
              <p class="text-xs md:text-sm lg:text-base">No Sensor Data</p>
              <p class="text-xs md:text-sm lg:text-base font-semibold">{{realtimeDevicesStatus.unreadbleSensors}} machines</p>
            </div>
            <div class="flex flex-col justify-between gap-2 border-l-4  border-[#E63946] px-4 py-2 w-full">
              <p class="text-xs md:text-sm lg:text-base">Undefined</p>
              <p class="text-xs md:text-sm lg:text-base font-semibold">{{realtimeDevicesStatus.undefined}} machines</p>
            </div>
          </div>
        </div>
        <div class="card border border-[#E63946] w-full justify-center items-center col-span-1" >
            <h1 class="font-bold text-3xl mb-6">{{realtimeDevicesStatus.offline}}/{{realtimeDevicesStatus.total}}</h1>
            <h2 class="text-xl">Offline Devices</h2>
        </div>
      </div>
      <div class="table-wrap">
        <div class="table-header">
          <h1 class="title"> Offline Devices</h1>
        </div>
        <SearchField class="outlined" v-model="offlineTableSearchValue" placeholder="Search by IMEI, variant, device name..."/>
        <EasyDataTable
        table-class-name="customize-table"
        :loading="loading"
        :headers="offlineTableHeader"
        :items="offlineDevices"
        theme-color="#1363df"        
        :search-value="offlineTableSearchValue"
        header-text-direction="center"
        @click-row="handleRowClick"
        body-text-direction="center"
        >
        </EasyDataTable>
      </div>
      <div class="table-wrap">
        <div class="table-header">
          <h1 class="title"> Online Devices</h1>
        </div>
        <SearchField class="outlined" v-model="onlineTableSearchValue" placeholder="Search by IMEI, variant, device name..."/>
        <EasyDataTable
        table-class-name="customize-table"
        :loading="loading"
        :headers="onlineTableHeader"
        :items="onlineDevices"
        theme-color="#1363df"        
        :search-value="onlineTableSearchValue"
        header-text-direction="center"
        @click-row="handleRowClick"
        body-text-direction="center"
        >
          <template #item-PowerMesin="item">
            <div class="w-full flex justify-center">
              <Indicator :status="item.PowerMesin"/>
            </div>
          </template>
          <template #item-RunMesin="item">
            <div class="w-full flex justify-center">
              <Indicator :status="item.RunMesin"/>
            </div>
          </template>
          <template #item-InputBarang="item">
            <div class="w-full flex justify-center">
              <Indicator :status="item.InputBarang"/>
            </div>
          </template>
          <template #item-OutputBarang="item">
            <div class="w-full flex justify-center">
              <Indicator :status="item.OutputBarang"/>
            </div>
          </template>
        </EasyDataTable>
      </div>
      <div class="table-wrap">
        <div class="table-header">
          <h1 class="title"> Devices Actual Check</h1>
          <div class="text-left">
            <p>notes : </p>
            <p>- hilangkan ceklis mesin yang tidak sesuai dengan aktual di lapangan</p>
            <p>- refresh rate 30 detik</p>
          </div>
        </div>
        <SearchField class="outlined" v-model="offlineTableSearchValue" placeholder="Search by IMEI, variant, device name..."/>
        <EasyDataTable
          table-class-name="customize-table"
          :loading="loading"
          :headers="devicesTableHeader"
          :items="devicesSelected"
          theme-color="#1363df"        
          :search-value="offlineTableSearchValue"
          show-index
          >
          <template #item-RunMachine="item">
            <div class="operation">
              <p>{{ item.RunMachine == true  ? 'match' : 'not match' }}</p>
              <input type="checkbox" v-model="item.RunMachine" value="RunMachine"  @change=updateDevicesSelected(item)>
            </div>
          </template>
          <template #item-PowerMachine="item">
            <div class="operation">
              <p>{{ item.PowerMachine == true  ? 'match' : 'not match' }}</p>
              <input type="checkbox" v-model="item.PowerMachine" value="PowerMachine"  @change=updateDevicesSelected(item)>
            </div>
          </template>
          <template #item-RPM="item">
            <div class="operation">
              <p>{{ item.RPM == true  ? 'match' : 'not match' }}</p>
              <input type="checkbox" v-model="item.RPM" value="RPM"  @change=updateDevicesSelected(item)>
            </div>
          </template>
          <template #item-InputBarang="item">
            <div class="operation">
              <p>{{ item.InputBarang == true  ? 'match' : 'not match' }}</p>
              <input type="checkbox" v-model="item.InputBarang" value="InputBarang"  @change=updateDevicesSelected(item)>
            </div>
          </template>
          <template #item-OutputBarang="item">
            <div class="operation">
              <p>{{ item.OutputBarang == true  ? 'match' : 'not match' }}</p>
              <input type="checkbox" v-model="item.OutputBarang" value="OutputBarang"  @change=updateDevicesSelected(item)>
            </div>
          </template>
        </EasyDataTable>
        <download-csv
        	class   = "btn btn-default mt-6 justify-end flex"
        	:data   = "devicesSelectedExport"
        	:name    = "fileName">
          <div class="button-wrapper">
            <BaseButton label="Export CSV" class="filled__blue" @click="exportCSV" />
          </div>
        </download-csv>
      </div>
    </div>
  </div> 
</template>
  
<script setup>

import SearchField from '@/components/SearchField.vue'
import Indicator from '@/components/Indicator.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import { storeToRefs } from 'pinia'
import { ref, onUnmounted, onMounted, watch, watchEffect, onBeforeMount } from 'vue';
import sideNav from '@/components/navigation/sideNav.vue'
import { useMasterDataStore } from '@/stores/MasterDataStore'
import { useDataStore } from '@/stores/DataStore'
import lazyCard from '@/components/loading/lazyCard.vue'
import { useLocalStorage } from "@vueuse/core"
import router from '@/router'

const devicesSelected = useLocalStorage('witDevicesSelected',[])
const devicesSelectedExport = useLocalStorage('witDevicesSelectedExport',[])

function updateDevicesSelected(item) {
  devicesSelected.value[item.index-1] = item
  devicesSelectedExport.value[item.index-1] = item
  delete devicesSelectedExport.value[item.index-1].key
  delete devicesSelectedExport.value[item.index-1].index
  console.log(devicesSelectedExport.value)
  if (item.RunMachine == true && item.PowerMachine == true && item.RPM == true && item.InputBarang == true && item.OutputBarang == true) {
    console.log('all true')
    devicesSelectedExport.value = devicesSelectedExport.value.filter(obj => obj.machine_name !== item.machine_name)
    console.log(devicesSelectedExport.value)
  } 
}


//dropdown filter
const selectedFloor = useLocalStorage('selectedFloor','0')
const selectedAirioTray = useLocalStorage('selectedAirioTray','TrayG')
const offlineTableSearchValue = ref('')
const onlineTableSearchValue = ref('')

const fileName = ref(new Date(Date.now()).toLocaleString() + '_' + selectedAirioTray.value.toString() + '_.csv')

//watch selected floor to get tray
// watch(() => selectedFloor.value, async() => {
//   let params = { floor: selectedFloor.value }
//   await masterDataStore.getAirio1(params)
//   selectedAirioTray.value = 1.value[0]
// })

// //watch selected tray to get device
// watch(() => selectedAirioTray.value, async() => {
//   masterDataParams.value.tray = selectedAirioTray.value
//   realtimeDataParams.value.tray = selectedAirioTray.value
//   await masterDataStore.getAirioDevices(masterDataParams.value)
// })

//stores
const masterDataStore = useMasterDataStore()
const { floors, trays, witDevices } = storeToRefs(useMasterDataStore())
const dataStore = useDataStore()
const { offlineDevices, onlineDevices } = storeToRefs(useDataStore())
const loading = ref(false)

watch(() => witDevices.value, () => {
  if (localStorage.getItem('witDevicesSelected') == "[]") {
    devicesSelected.value = witDevices.value
  } 
})
//alert
const modalActive = ref(false)
const alertMessage = ref('')
const isError = ref(false)
const closeNotification = () => {
  modalActive.value = false
}

//query params
const realtimeDataParams = ref({
  floor: selectedFloor.value,
  tray: selectedAirioTray.value
})
const masterDataParams = ref({
  tray: selectedAirioTray.value
})

//realtime data variable
const realtimeDevicesStatus = ref({
  normal: '-',
  off: '-',
  idle: '-',
  faultySensors: '-',
  unreadbleSensors: '-',
  undefined: '-',
  online: '-',
  offline: '-',
  total: '-'
})
const lastUpdate = ref('-')


//lifecycles
onBeforeMount( async () => {
  await masterDataStore.getAirioFloors()
  selectedFloor.value = floors.value[0]
  while (whileState.value) {
    masterDataParams.value.tray = selectedAirioTray.value
    realtimeDataParams.value.floor = selectedFloor.value
    realtimeDataParams.value.tray = selectedAirioTray.value
    await getRealtimeData()
    await delay(3000)
  }
})

onMounted(async () => {
  await masterDataStore.getAirioDevices(masterDataParams.value)
  console.log(witDevices.value)
})

onUnmounted(() => {
  whileState.value = false
})

//watch realtimeDeviceStatus to update Last Update data
watch(() => dataStore.realtimeDevicesStatus, () => {
  if (dataStore.realtimeData != undefined) {
    lastUpdate.value = dataStore.realtimeData[0] == undefined ? '-' :  new Date (dataStore.realtimeData[0]._time).toLocaleString()
  }
  realtimeDevicesStatus.value = dataStore.realtimeDevicesStatus
})


const delay = require('delay')
const whileState = ref(true)

//fetch realtime data function
async function getRealtimeData() {
  await dataStore.getAirioRealtimeData(realtimeDataParams.value)
}

//table header
const offlineTableHeader = [
  { text: "Machine Name", value: "machine_name" },
  { text: "Device ID", value: "device_id" },
  { text: "Error Description", value: "message"},
  { text: "Last Heard", value: "last_heard", sortable: true },
]
const onlineTableHeader = [
  { text: "Machine Name", value: "machine_name" },
  { text: "Device ID", value: "device_id" },
  // { text: "Machine Type", value: "machine_type" ,sortable: true},
  { text: "Error Description", value: "message", sortable: true },
  // { text: "Machine Power", value: "PowerMesin", sortable: true},
  { text: "Machine Running", value: "RunMesin", sortable: true },
  { text: "RPM", value: "RPM", sortable: true },
  { text: "Input Sensor", value: "InputBarang", sortable: true },
  { text: "Output Sensor", value: "OutputBarang", sortable: true },
  { text: "Uptime (min)", value: "uptime", sortable: true },
  { text: "Last Heard", value: "last_heard", sortable: true },
]
  
const devicesTableHeader = [
  { text: "Machine Name", value: "machine_name" },
  { text: "Device ID", value: "device_id" },
  { text: "Run Machine", value: "RunMachine" },
  { text: "RPM", value: "RPM" },
  { text: "Input Sensor", value: "InputBarang" },
  { text: "Output Sensor", value: "OutputBarang" },
]
    
async function exportCSV() {
  if (devicesSelected.value.length == 0) {
    alertMessage.value = 'Check the device first'
    isError.value = true
    modalActive.value = true
    setTimeout(closeNotification, 3000)
  } else {
    await delay(2000)
    devicesSelected.value = witDevices.value
    devicesSelectedExport.value = []
  }
}
function handleRowClick(event) {
  // Handle row click here
  router.push({ name: 'quickWitReport', params: { floor: event.floor, tray: event.tray , device: event.device_id } });
  console.log('Row clicked:', event);
}
// async function filterRealtimeData() {
//   if (selectedFloor.value != '0' && selectedAirioTray.value !='0') {
//     realtimeDataParams.value.floor = selectedFloor.value
//     realtimeDataParams.value.tray = selectedAirioTray.value
//     loading.value = true
//     await getRealtimeData()
//     loading.value = false
//   } else {
//     alertMessage.value = 'Please select floor and tray first'
//     isError.value = true
//     modalActive.value = true
//     setTimeout(closeNotification, 3000)
//   }
// }
</script>
  
<style scoped>


.select-option {
  @apply px-3 py-2 cursor-pointer bg-white outline-none border border-[#E5E5EA] rounded-md
}
.table-wrap {
  @apply
    overflow-auto sm:overflow-visible bg-white p-10 rounded-2xl
}
.table-header {
  @apply
  flex flex-row w-full justify-between mb-[20px]
}

.operation {
  @apply flex gap-4
}

.customize-table {
  --easy-table-border:	1px solid #EBEBED;	
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: transparent;
  --easy-table-header-font-color:	#6E6E78;
  --easy-table-header-height:	40px;

  --easy-table-body-row-font-size:	14px;
  --easy-table-body-font-color:	#3A3A3E;
  --easy-table-body-row-height:	46px;

  --easy-table-footer-font-size:	12px;
  --easy-table-footer-height:	40px;
  --easy-table-footer-font-color:	#6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: hidden;
}

.content {
  @apply w-full h-fit relative
}
.device-container {
  @apply 
    flex flex-col gap-9 p-[32px]
}
.title {
  @apply
    text-[28px] font-bold flex justify-start items-center text-[#3A3A3A] opacity-80
}
.card-wrapper {
  @apply
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 
}
.card {
  @apply 
    rounded-2xl bg-white
    flex flex-col p-10 text-left gap-2
}
.select-option:hover {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  @apply transition-all
}
  </style>