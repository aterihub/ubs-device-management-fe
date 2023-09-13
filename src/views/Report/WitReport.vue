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
            <option value="TrayG" selected>Tray G</option>
          </select>
          <select v-model="selectedDevice" class="select-option ">
            <option value="-" selected>Select Device</option>
            <option v-for="item in witDevices" :key="item.id" :value="item.device_id">
              <p class="font-semibold">{{ item.machine_name }}</p>
            </option>
          </select>
          <div class="w-28">
            <Button type="submit" class="filled__blue" label="Filter" :loading="loading" />
          </div>
        </div>
      </form>
    </div>
    <div class="table-wrap mb-10">
      <div class="table-header">
        <h1 class="title font-light">Reboot Counter</h1>
        <h2 class="font-extralight mt-2"> Total Reboot: <span class="pl-2 font-semibold">{{ airioRebootCounter }}</span></h2>
      </div>
      <SearchField class="outlined" v-model="rebootDetailSearchValue" placeholder="Search..."/>
      <EasyDataTable
        table-class-name="customize-table"
        :loading="rebootLoading"
        :headers="rebootDetailHeader"
        :items="airioRebootDetail"
        theme-color="#1363df"        
        :search-value="rebootDetailSearchValue"
        header-text-direction="center"
        body-text-direction="center"
        >
      </EasyDataTable>
    </div>
    <div class="table-wrap mb-10">
      <div class="table-header">
        <h1 class="title font-light"> Data Density</h1>
        <h2 class="font-extralight mt-2"> Expected Data Density: <span class="font-semibold">720 Data / Hour</span></h2>
      </div>
      <SearchField class="outlined" v-model="dataDensitySearchValue" placeholder="Search..."/>
      <EasyDataTable
        table-class-name="customize-table"
        :loading="densityLoading"
        :headers="dataDensityHeader"
        :items="airioDataDensity"
        theme-color="#1363df"        
        :search-value="dataDensitySearchValue"
        header-text-direction="center"
        body-text-direction="center"
        >
      </EasyDataTable>
    </div>
    <div class="table-wrap mb-10">
      <div class="table-header">
        <h1 class="title font-light"> Data Duplicate</h1>
      </div>
      <EasyDataTable
        table-class-name="customize-table"
        :loading="duplicateLoading"
        :headers="duplicateHeader"
        :items="airioDuplicateData"
        theme-color="#1363df"        
        header-text-direction="center"
        body-text-direction="center"
        >
      </EasyDataTable>
    </div>
    <div class="table-wrap mb-10">
      <div class="table-header">
        <h1 class="title font-light"> Data Missing</h1>
      </div>
      <EasyDataTable
        table-class-name="customize-table"
        :loading="missingLoading"
        :headers="duplicateHeader"
        :items="airioMissingData"
        theme-color="#1363df"        
        header-text-direction="center"
        body-text-direction="center"
        >
      </EasyDataTable>
    </div>
    <div class="table-wrap">
      <div class="table-header">
        <h1 class="title font-light"> Data Clean</h1>
      </div>
      <EasyDataTable
        table-class-name="customize-table"
        :loading="cleanLoading"
        :headers="dataDensityHeader"
        :items="airioCleanData"
        theme-color="#1363df"        
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
import { onMounted, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/stores/DataStore'
import { useMasterDataStore } from '@/stores/MasterDataStore'
import { useLocalStorage } from "@vueuse/core"
import { useRoute } from 'vue-router'


  const props = defineProps({
    floor:String,
    tray:String,
    device:String
  })

  //checking if route has params
  const route = useRoute()
  const paramAvailable = computed(() => {
    return route.params.hasOwnProperty('floor');
  })

  const loading = ref(false)
  const rebootLoading = ref(false)
  const densityLoading = ref(false)
  const duplicateLoading = ref(false)
  const missingLoading = ref(false)
  const cleanLoading = ref(false)
  const airioCleanData = ref([])

  //alert
  const modalActive = ref(false)
  const alertMessage = ref('')
  const isError = ref(false)
  const closeNotification = () => {
    modalActive.value = false
  }
  //dropdown filter
  const selectedFloor = useLocalStorage('airioSelectedFloor','LT2')
  const selectedTray = useLocalStorage('airioSelectedAirioTray','TrayG')
  const selectedDevice = useLocalStorage('airioSelectedDevice','-')
  const startDate = ref(new Date().toLocaleDateString('en-CA'))
  const startTime = useLocalStorage('airioStartTime', '-')
  const endDate = ref(new Date().toLocaleDateString('en-CA'))
  const endTime = useLocalStorage('airioEndTime', '-')

  watch(() => selectedFloor.value, async() => {
    let params = { floor: selectedFloor.value }
    await masterDataStore.getAirioTrays(params)
  })

  watch(() => selectedTray.value, async() => {
    let params = { tray: selectedTray.value }
    await masterDataStore.getAirioDevices(params)
  })

  //stores
  const masterDataStore = useMasterDataStore()
  const { floors, trays, witDevices } = storeToRefs(useMasterDataStore())
  const dataStore = useDataStore()
  const { airioDataDensity, airioRebootCounter, airioRebootDetail, airioDuplicateData, airioMissingData, airioRawDataDensity, airioRawDuplicateData } = storeToRefs(useDataStore())

  onMounted( async () => {
    await masterDataStore.getAirioFloors()
    let params = { tray: selectedTray.value }
    await masterDataStore.getAirioDevices(params)
    if (paramAvailable.value) {
      selectedFloor.value = route.params.floor  
      // selectedTray.value = route.params.tray  
      selectedDevice.value = route.params.device  
    }
  })

  
  async function filterData() {    
    if (paramAvailable.value) {
      route.params.floor = selectedFloor.value
      route.params.tray = selectedTray.value
      route.params.device = selectedDevice.value
    }
    if (selectedFloor.value != '0' && selectedTray.value != '0' && selectedDevice.value != '-' && startTime.value != '' && endTime.value != '') {
      let params = {
        device: selectedDevice.value,
        start: new Date(startDate.value + 'T' + startTime.value).toISOString(),
        stop: new Date(endDate.value + 'T' + endTime.value).toISOString()
      }
      loading.value = true
      rebootLoading.value = true
      densityLoading.value = true
      duplicateLoading.value = true
      cleanLoading.value = true
      missingLoading.value = true
      await dataStore.getAirioRebootCounter(params)
      rebootLoading.value = false
      await dataStore.getAirioDataDensity(params)
      densityLoading.value = false
      await dataStore.getAirioDuplicate(params)
      duplicateLoading.value = false
      await dataStore.getAirioMissingData(params)
      missingLoading.value = false
      await dataStore.getAirioCleanData(params)
      airioCleanData.value = await calculateCleanData(airioRawDataDensity.value, airioRawDuplicateData.value)
      cleanLoading.value = false
      loading.value = false
    } else {
      alertMessage.value = 'Please select time, floor, tray, device first'
      isError.value = true
      modalActive.value = true
      setTimeout(closeNotification, 3000)
    }
  }

  async function calculateCleanData(density, duplicate) {
    const newArray = density.map((item1, index) => {
      const item2 = duplicate[index] 
        return {
          _time: new Date (item1._time).toLocaleString(),
          RunMesin: (item1.RunMesin - item2.runMesin) + ' (' + (((item1.RunMesin - item2.runMesin)/720)*100).toFixed(1) + '%)',
          RPM: (item1.RPM - item2.rpm) + ' (' + (((item1.RPM - item2.rpm)/720)*100).toFixed(1) + '%)',
          InputBarang: (item1.InputBarang - item2.inputBarang) + ' (' + (((item1.InputBarang - item2.inputBarang)/720)*100).toFixed(1) + '%)',
          OutputBarang: (item1.OutputBarang - item2.outputBarang) + ' (' + (((item1.OutputBarang - item2.outputBarang)/720)*100).toFixed(1) + '%)',
        }
    })
    return newArray
  }
  const dataDensitySearchValue = ref('')
  const rebootDetailSearchValue = ref('')
  const dataDensityHeader = [
    { text: "Date time", value: "_time" },
    { text: "Run Mesin", value: "RunMesin", sortable: true },
    { text: "RPM", value: "RPM", sortable: true },
    { text: "Input Sensor", value: "InputBarang", sortable: true },
    { text: "Output Sensor", value: "OutputBarang", sortable: true },
  ]
  const rebootDetailHeader = [
    { text: "Date time", value: "_time" },
    { text: "State", value: "state" ,sortable: true},
    { text: "Detail", value: "detail" ,sortable: true},
  ]
  const duplicateHeader = [
    { text: "Date time", value: "_time" },
    { text: "Run Machine", value: "runMesin" ,sortable: true},
    { text: "RPM", value: "rpm" ,sortable: true},
    { text: "Input Sensor", value: "inputBarang" ,sortable: true},
    { text: "Output Sensor", value: "outputBarang" ,sortable: true},
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

tbody tr:hover {
  cursor: pointer;
}

  </style>