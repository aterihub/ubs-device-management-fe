<template>
  <div class="device-info bg-[#F7F7F7] rounded-lg w-full py-5 px-10">
    <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" ref="form" >
      <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
        <div class="text-wrapper flex flex-col gap-6 text-left w-full">
          <BaseInput v-model="deviceData.deviceName" name="deviceName" type="text" placeholder="What would you like to call this device" class="outlined" label="Device Name"/>
          <BaseInput v-model="deviceData.deviceType" name="deviceType" type="text" placeholder="Categorize your device" class="outlined" label="Device Type"/>
        </div>
        <div class="text-wrapper flex flex-col gap-6 text-left w-full">
          <BaseInput v-model="deviceData.SIMNumber" name="SIMNumber" type="tel" placeholder="Enter your SIM number here" class="outlined" label="SIM Number"/>
          <BaseInput v-model="deviceData.SIMInfo" name="SIMInfo" type="link" placeholder="Enter your SIM information here" class="outlined" label="SIM Information"/>
        </div>
        <div class="text-wrapper flex flex-col justify-between text-left w-full">
          <TextArea v-model="deviceData.notes" name="notes" placeholder="Write notes for this device" class="outlined" label="Notes"></TextArea>
          <div class="flex justify-between gap-10">
            <BaseButton type="submit" class="filled__blue" :label="updateLabel" :loading="updateDeviceIsLoading"  />
          </div>
        </div> 
      </form>
    </VeeForm>
  </div>
</template>
         
<script setup>

import { useDevicesStore } from '@/stores/DevicesStore'
import { storeToRefs } from 'pinia'
import { Form as VeeForm } from 'vee-validate'
import { updateDeviceSchema } from '@/composable/devicesSchema'
import { ref } from 'vue';
import BaseInput from '@/components/input/BaseInput.vue'
import TextArea from '@/components/input/TextArea.vue'
import BaseButton from '@/components/button/BaseButton.vue' 

  const props = defineProps({
    id: String
  })
  const schema = updateDeviceSchema
  const devicesStore = useDevicesStore()
  const { updateDeviceIsLoading, deviceData } = storeToRefs(useDevicesStore())

  
  const updateLabel = ref('UPDATE')
  const updateButtonClick = ref(0)
  const emits = defineEmits(['updated'])

  const onSubmit = async (values) => {
    updateButtonClick.value = ++updateButtonClick.value
    if (updateButtonClick.value == 1) {
      updateLabel.value = 'the data entered is correct?'
    }

    if (updateButtonClick.value == 2) {
      await devicesStore.updateDevice(deviceData.value.id,values)
      emits('updated')
      updateLabel.value = 'UPDATE'
      updateButtonClick.value = 0
    }
  }


  
</script>
        
<style scoped>

.form-wrapper {
  @apply  flex flex-col sm:flex-row gap-3 sm:justify-between
}
  </style>