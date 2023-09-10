<template>
  <alert 
    :message ="alertMessage"
    :modalActive="modalActive"
    :isError="isError"
    @close="closeNotification" />
<sideNav :isReportActive="true" />
<div class="content">
  <div class="device-container">
    <h1 class="title font-bold mb-6">Devices Performace Dashboard</h1>
    <div class="flex flex-row lg:flex-col items-center mb-10 w-full">
      <form @submit.prevent="filterData" class="flex gap-4 items-center w-full justify-between">
        <div class="flex gap-4">
          <div class="text-left flex flex-col select-option ">
            <h2 class="font-semibold">From</h2>
            <div class="flex gap-6 ">
              <input class="cursor-pointer bg-transparent" type="date" name="startDate" id="startDate" v-model="startDate">
              <input class="cursor-pointer bg-transparent" type="time" step="3600" name="startTime" id="startTime" v-model="startTime">
            </div>
          </div>
          <div class="text-left flex flex-col select-option">
            <h2 class="font-semibold">To</h2>
            <div class="flex gap-6">
              <input class="cursor-pointer bg-transparent" type="date" name="endDate" id="endDate" v-model="endDate">
              <input class="cursor-pointer bg-transparent" type="time" step="3600" name="endTime" id="endTime" v-model="endTime">
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <select v-model="selectedFloor" class="select-option ">
            <option value="0" selected>Select Floor</option>
            <option v-for="item in floors" :key="item" :value="item">
              <p class="font-semibold">{{ item }}</p>
          </option>
          </select>
          <select v-model="selectedTray" class="select-option ">
            <option value="0" selected>Select Tray</option>
            <option v-for="item in trays" :key="item.id" :value="item">
              <p class="font-semibold">{{ item }}</p>
            </option>
          </select>
          <select v-model="selectedDevice" class="select-option ">
            <option value="-" selected>Select Device</option>
            <option v-for="item in devices" :key="item.id" :value="item">
              <p class="font-semibold">{{ item }}</p>
            </option>
          </select>
          <div class="w-28">
            <Button type="submit" class="filled__blue" label="Filter" :loading="loading" />
          </div>
        </div>
      </form>
      </div>
      <div class="mb-6 flex gap-10">
        <h1 class="title font-light"> Device: <span class="pl-2 font-semibold">{{ selectedDevice }} </span></h1>
        <h1 class="title font-light">Total Reboot: <span class="pl-2 font-semibold">{{ rebootCounter }}</span></h1>
      </div>
      <div class="table-wrap">
        <div class="table-header">
          <h1 class="title font-light"> Data Density</h1>
          <h2 class="font-extralight mt-2"> Expected Data Density: <span class="font-semibold">720 Data</span></h2>
        </div>
        <SearchField class="outlined" v-model="dataDensitySearchValue" placeholder="Search by IMEI, variant, device name..."/>
        <EasyDataTable
        table-class-name="customize-table"
        :loading="loading"
        :headers="dataDensityHeader"
        :items="dataDensity"
        theme-color="#1363df"        
        :search-value="dataDensitySearchValue"
        header-text-direction="center"
        body-text-direction="center"
        >
      </EasyDataTable>
    </div>
  </div> 
</div>    
</template>
  
<script setup>
import sideNav from '@/components/navigation/sideNav.vue'
import SearchField from '@/components/SearchField.vue'
import Button from '@/components/button/BaseButton.vue'
import { onMounted, ref, watch} from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/stores/DataStore'
import { useMasterDataStore } from '@/stores/MasterDataStore'
  
  const loading = ref(false)

  //alert
  const modalActive = ref(false)
  const alertMessage = ref('')
  const isError = ref(false)
  const closeNotification = () => {
    modalActive.value = false
  }
  //dropdown filter
  const selectedFloor = ref('0')
  const selectedTray = ref('0')
  const selectedDevice = ref('-')
  const startDate = ref(new Date().toLocaleDateString('en-CA'))
  const startTime = ref('')
  const endDate = ref(new Date().toLocaleDateString('en-CA'))
  const endTime = ref('')

  watch(() => selectedFloor.value, async() => {
    let params = { floor: selectedFloor.value }
    await masterDataStore.getTrays(params)
  })
  watch(() => selectedTray.value, async() => {
    let params = { tray: selectedTray.value }
    await masterDataStore.getDevices(params)
  })

  //stores
  const masterDataStore = useMasterDataStore()
  const { floors, trays, devices } = storeToRefs(useMasterDataStore())
  const dataStore = useDataStore()
  const { dataDensity, rebootCounter } = storeToRefs(useDataStore())

  onMounted( async () => {
    await masterDataStore.getFloors()
  })

  
  async function filterData() {
    console.log()
    if (selectedFloor.value != '0' && selectedTray.value != '0' && selectedDevice.value != '-' && startTime.value != '' && startTime.value != '') {
      let params = {
        device: selectedDevice.value,
        start: new Date(startDate.value + 'T' + startTime.value).toISOString(),
        stop: new Date(endDate.value + 'T' + endTime.value).toISOString()
      }
      loading.value = true
      await dataStore.getDataDensity(params)
      await dataStore.getRebootCounter(params)
      loading.value = false
    } else {
      alertMessage.value = 'Please select time, floor, tray, device first'
      isError.value = true
      modalActive.value = true
      setTimeout(closeNotification, 3000)
    }
  }

  const dataDensitySearchValue = ref('')
  const dataDensityHeader = [
    { text: "Date time", value: "_time" },
    { text: "Power Mesin", value: "PowerMesin" ,sortable: true},
    { text: "Power Mesin Percentage", value: "PowerMesinPercentage" ,sortable: true},
    { text: "Run Mesin", value: "RunMesin", sortable: true },
    { text: "Run Mesin Percentage", value: "RunMesinPercentage", sortable: true },
    { text: "RPM", value: "RPM", sortable: true },
    { text: "RPM Percentage", value: "RPMPercentage", sortable: true },
    { text: "Input Sensor", value: "InputBarang", sortable: true },
    { text: "Input Sensor Percentage", value: "InputBarangPercentage", sortable: true },
    { text: "Output Sensor", value: "OutputBarang", sortable: true },
    { text: "Output Sensor Percentage", value: "OutputBarangPercentage", sortable: true },
  ]


</script>
  
<style scoped>


.select-option {
  @apply px-3 py-2 cursor-pointer bg-white outline-none border border-[#E5E5EA] rounded-md
}
.content {
  @apply w-full h-fit 
}
.device-container {
  @apply 
    p-[32px]
}
.title {
  @apply
    text-[28px] flex justify-start items-center text-[#353535] opacity-80
}
.table-wrap {
  @apply
    overflow-auto sm:overflow-visible bg-white p-10 rounded-2xl
}
.table-header {
  @apply
  flex flex-col w-full items-start mb-[16px]
}
/* .search-wrapper {
  @apply
    w-[280px] h-[40px]
} */
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
input[type="time"]::-webkit-calendar-picker-indicator {
    display: none;
}

  </style>