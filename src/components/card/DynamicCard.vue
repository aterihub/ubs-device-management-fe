<template>
  <div class="card">
    <div class="flex justify-between">
      <Indicator :status="loading"/>
      <div class="close-btn cursor-pointer" @click="emits('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3ZM15.6 17L12 13.4L8.4 17L7 15.6L10.6 12L7 8.4L8.4 7L12 10.6L15.6 7L17 8.4L13.4 12L17 15.6L15.6 17Z" fill="#7C7C7C"/>
        </svg>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="flex flex-col gap-2 items-start text-sm m-4">
        <p class="text-left font-medium ">AVL ID</p>
        <input type="number" placeholder="Input AVL ID" v-model="avlID">
      </div>
      <div class="flex flex-col gap-2 items-start text-sm m-4">
        <p class="text-left font-medium ">Data ID</p>
        <input type="number" placeholder="Input Data ID" v-model="dataID" @change="getCANInterval">
      </div>
      <div class="flex flex-col gap-2 items-start text-sm mx-4 mb-4">
        <p class="text-left font-medium ">Constant Value</p>
        <input type="number" placeholder="Input Data ID" v-model="constVal" @change="calculateValue">
      </div>
      <div class="flex flex-col gap-2 items-start text-sm mx-4 mb-4">
        <p class="text-left font-medium ">Offset Value</p>
        <input type="number" placeholder="Input Data ID" v-model="offsetVal" @change="calculateValue">
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="flex gap-2 items-center mx-4 mb-4 h-[80px]">
        <div class="w-[6px] h-[72px] bg-[#D3E6FA] rounded-full"></div>
      <div>
          <p class="text-[#2482E6] text-[16px] font-bold text-left">Raw Data</p>
          <p class="text-[#2482E6] text-[24px] font-bold text-left">{{ props.CANData }}</p>
        </div> 
      </div>
      <div class="flex gap-2 items-center mx-4 mb-4 h-[80px]">
        <div class="w-[6px] h-[72px] bg-[#D3E6FA] rounded-full"></div>
        <div>
          <p class="text-[#2482E6] text-[16px] font-bold text-left">Calculated Data</p>
          <p class="text-[#2482E6] text-[24px] font-bold text-left">{{ calculatedVal }}</p>
        </div> 
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, defineEmits, onUnmounted, computed} from 'vue'
import Indicator from '@/components/Indicator.vue'


const constVal = ref(1)
const offsetVal = ref(0)
const calculatedVal = ref('-')
const dataID = ref()
const avlID = ref()
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean
  },
  CANData: null
});

const emits = defineEmits(['close','updateParams'])

function getCANInterval(){
  emits('updateParams', avlID.value,dataID.value)
}

function calculateValue() {
  calculatedVal.value = (props.CANData * constVal.value) + offsetVal.value
}

// const CANData = computed(() => {
//       return props.CANData
//     })
  
</script> 

<style scoped>
.card {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
  @apply 
  flex flex-col min-w-full p-2 rounded-lg h-fit gap-0 !important
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
  