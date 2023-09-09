<template>
  <div class="flex flex-col max-w-[800px] w-full rounded" v-for="(tData, index) in data" :key="tData" v-show="!tData.length == 0">
    <div
      @click="toggleAccordion(index)" 
      class="flex w-full justify-between bg-[#E8F1FF]/80 backdrop-blur-lg py-4 px-4 cursor-pointer  rounded"
      :class="{'active': isOpen[index]}">
      <!-- <slot name="title" /> -->
      <div class="text-xl font-semibold">
            <span>Station N: {{tData[0].stazione}}</span>
      </div>
      <button
        class="flex items-center space-x-3"
        :aria-expanded="isOpen[index]"
        :aria-controls="`collapse`"
      >
        <svg
          class="w-3 transition-all duration-200 transform"
          :class="{
            'rotate-180': isOpen[index],
            'rotate-0': !isOpen[index],
          }"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 10"
          aria-hidden="true"
        >
          <path
            d="M15 1.2l-7 7-7-7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <!-- <slot name="subtitle" /> -->
    <div
      v-for="valve in tData" :key="valve" 
      class="flex w-full justify-between bg-[#DDE8FA]/60 backdrop-blur-lg py-2 px-4">
      <span class="text-sm font-semibold">EV N<sup>o</sup> : {{valve.id}} Serial : {{valve.ev}} (Master No: {{valve.masterv}} - Pompa No: {{valve.pompa}})</span>
    </div>
    <div 
      v-show="isOpen[index]" :id="`collapse`"
      class="flex w-full flex-col justify-between gap-10 bg-[#DDE8FA]/60 backdrop-blur-lg py-2 px-4"
    >
      <form 
        v-for="valve in tData" :key="valve" 
        class="edit-form " @submit.prevent="editConfiguration(valve)">
        <div class="flex w-full py-2 justify-center items-center text-xl font-bold bg-[#E6EDCB]">
          <span>Configura</span>
        </div>
        <div class="flex items-center py-2 border-t-2 border-[#EFF5E4]">
          <span class="font-semibold w-[360px] text-left">Elettrovalvova No:</span>
          <select  class="dropdown" v-model = "valve.id" :value="valve.id" disabled>
            <option value="0">OFF</option>
            <option 
              v-for="option in props.solenoidList" :key="option"
              class="nav"
              @click="onClick(option.index)"
              :value="option.index"
              :id="option.index">{{option.index}} : {{option.title}}</option>
          </select>
        </div>
        <div class="flex items-center py-2 border-t-2 border-[#EFF5E4]">
          <span class="font-semibold w-[360px] text-left">Pompa No:</span>
          <select  class="dropdown" v-model = "valve.pompa" :value="valve.pompa">
            <option value="0">OFF</option>
            <option 
              v-for="option in props.pumpList" :key="option"
              class="nav"
              @click="onClick(option.index)"
              :value="option.index"
              :id="option.index">{{option.index}} : {{option.title}}</option>
          </select>
        </div>
        <div class="flex items-center py-2 border-t-2 border-[#EFF5E4]">
          <span class="font-semibold w-[360px] text-left">Master No:</span>
          <select  class="dropdown" v-model = "valve.masterv" :value="valve.masterv">
            <option value="0">OFF</option>
            <option 
              v-for="option in props.masterList" :key="option"
              class="nav"
              @click="onClick(option.index)"
              :value="option.index"
              :id="option.index">{{option.index}} : {{option.title}}</option>
          </select>
        </div>
        <div class="w-20 flex gap-4">
          <IveButton type="submit" class="filled__blue" label="Aggiorna" :loading="postControlIsLoading"/>
          <IveButton type="button" class="filled__red" label="Resetta" :loading="postControlIsLoading" @click="restoreConfiguration(valve)"/>
        </div>
      </form>
      <form 
        class="add-form" 
        @submit.prevent="addConfiguration(tData[0],addFormData)">
        <div class="flex w-full py-2 justify-center items-center text-xl font-bold bg-[#E6EDCB]">
          <span>Aggiungi Configurazione</span>
        </div>
        <div class="flex items-center py-2 border-t-2 border-[#EFF5E4]">
          <span class="font-semibold w-[360px] text-left">Elettrovalvova No:</span>
          <select  class="dropdown" v-model="addFormData.evNumber" :value="addFormData.evNumber">
            <option value="0">OFF</option>
            <option 
              v-for="option in props.solenoidList" :key="option"
              class="nav"
              @click="onClick(option.index)"
              :value="option.index"
              :id="option.index">{{option.index}} : {{option.title}}</option>
          </select>
        </div>
        <div class="flex items-center py-2 border-t-2 border-[#EFF5E4]">
          <span class="font-semibold w-[360px] text-left">Pompa No:</span>
          <select  class="dropdown" v-model="addFormData.pump" :value="addFormData.pump">
            <option value="0">OFF</option>
            <option 
              v-for="option in props.pumpList" :key="option"
              class="nav"
              @click="onClick(option.index)"
              :value="option.index"
              :id="option.index">{{option.index}} : {{option.title}}</option>
          </select>
        </div>
        <div class="flex items-center py-2 border-t-2 border-[#EFF5E4]">
          <span class="font-semibold w-[360px] text-left">Master No:</span>
          <select  class="dropdown" v-model="addFormData.mv" :value="addFormData.mv">
            <option value="0">OFF</option>
            <option 
              v-for="option in props.masterList" :key="option"
              class="nav"
              @click="onClick(option.index)"
              :value="option.index"
              :id="option.index">{{option.index}} : {{option.title}}</option>
          </select>
        </div>
        <div class="w-20">
          <IveButton type="submit" class="filled__blue" label="Salva" :loading="postControlIsLoading" />
        </div>
      </form>
      <!-- <slot name="content" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import IveButton from '@/components/button/BaseButton.vue'
import { useDataStore } from '@/stores/DataStore';
import { storeToRefs } from 'pinia'

//props
const props = defineProps({
   id: String,
   solenoidList: null,
   pumpList: null,
   masterList: null,
   masterValue: null,
   pumpValue: null,
   data: null,
   deviceCode: null
 })

//  State
const dataStore = useDataStore()
const { postControlIsLoading } = storeToRefs(useDataStore())

const postData = ref({
  command: 'EVCONFIG',
  payload: {}
})

const addFormData = ref({
  evNumber: 0,
  pump: 0,
  mv: 0
})



function toggleAccordion(index) {
  isOpen.value[index] = !isOpen.value[index]
  // console.log(isOpen.value)
}

function editConfiguration(valve) {
  console.log(valve)
  postData.value.payload = {}
  postData.value.payload['S' + (2002 + ((valve.id - 1) * 6))] = String(valve.stazione)
  postData.value.payload['S' + (2003 + ((valve.id - 1) * 6))] = String(valve.pompa)
  postData.value.payload['S' + (2004 + ((valve.id - 1) * 6))] = String(valve.masterv)
  console.log(postData.value)
  dataStore.postControl(props.deviceCode,postData.value)
}


function restoreConfiguration(valve) {
  console.log(valve)
  postData.value.payload = {}
  postData.value.payload['S' + (2002 + ((valve.id - 1) * 6))] = String(valve.id)
  postData.value.payload['S' + (2003 + ((valve.id - 1) * 6))] = String(valve.pompa)
  postData.value.payload['S' + (2004 + ((valve.id - 1) * 6))] = String(valve.masterv)
  console.log(postData.value)
  dataStore.postControl(props.deviceCode,postData.value)
}

function addConfiguration(tData, formData) {
  console.log(tData)
  console.log(formData)
  postData.value.payload = {}
  postData.value.payload['S' + (2002 + ((formData.evNumber - 1) * 6))] = String(tData.stazione)
  postData.value.payload['S' + (2003 + ((formData.evNumber - 1) * 6))] = String(formData.pump)
  postData.value.payload['S' + (2004 + ((formData.evNumber - 1) * 6))] = String(formData.mv)
  console.log(postData.value)
  dataStore.postControl(props.deviceCode,postData.value)
}

const isOpen = ref([])

for (let i = 0; i < props.data.length; i++) {
  isOpen[i].value = false
}

</script>

<style scoped>


input:checked + .switch {
  @apply bg-[#71D451] text-white
}

.switch {
  @apply cursor-pointer font-semibold w-28 text-left py-2 bg-white rounded px-2
}

.active {
  @apply text-[#3B83F6] border-[4px] border-[#3B83F6]/60
}

.dropdown {
  @apply pl-2 rounded w-20 sm:w-60 py-2 sm:py-3 cursor-pointer
}
</style>