<template>

    <sideNav :isDataActive="true" />
    <div class="content">
      <div class="device-container">
        <h1 class="title"> Data Monitoring </h1>
        <div class="card-wrapper">
          <h1 class="text-xl text-left mb-6"> CAN Data </h1>
          <div class="card">
            <input type="number" v-model="dataID" placeholder="Input Data ID">
            <div class="flex gap-6 items-center">
              <div class="w-[6px]  h-[52px] bg-[#D3E6FA] rounded-full"></div>
              <p class="text-[#2482E6] text-[28px] font-bold">{{canDataStore.CANData.dataValue}}</p>
            </div>
          </div>

        </div>
      </div> 
    </div>    
</template>
  
<script setup>
import Indicator from '@/components/Indicator.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import Button from '@/components/button/BaseButton.vue'
import { ref, onUnmounted, watch } from 'vue';
import { useCANDataStore } from '@/stores/CANDataStore'
import { debounce } from 'lodash';

const props = defineProps({
   id: {
     type: String,
     required: true
   }
 });
 const canDataStore = useCANDataStore()
 const dataID = ref()
 const getCANDataInterval = ref(null)
  

function getCANData() {
  canDataStore.getCANData(props.id,145,dataID.value)
}

watch(dataID, debounce((newValue) => {
  console.log(newValue)
  if (newValue != '') {
    getCANData()
    if (getCANDataInterval.value === null) {
      getCANDataInterval.value = setInterval(getCANData, 5000)
    }
  } else if (newValue === '') {
    clearInterval(getCANDataInterval.value)
    getCANDataInterval.value = null
  }
}, 200))
 
onUnmounted(() => {
  clearInterval(getCANDataInterval)
  getCANDataInterval.value = null
})

  
  

  
</script>
  
<style scoped>


.content {
  @apply w-full h-fit relative
}
.device-container {
  @apply 
    flex flex-col gap-9 p-[32px]
}
.title {
  @apply
    text-[28px] font-thin flex justify-start items-center text-[#353535] opacity-80
}
.card-wrapper {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
  @apply
    rounded-md bg-white
    flex flex-col p-6
    /* grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5  */
}
.card {
  @apply 
  flex flex-col gap-4 w-fit
}

input {
  @apply
  p-3 font-medium bg-transparent focus:outline-none w-32 text-sm
  border-solid border rounded-lg

} 

input::placeholder {
  @apply text-sm font-medium text-[#9A9EA4] 
} 
  </style>