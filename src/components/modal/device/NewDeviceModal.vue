<template>
  <div>
  <alert 
  :message ="status.message"
    :modalActive="modalActive"
    :isError="isError"
     @close="closeNotification" />
     <transition name="fade">
       <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
            <h1 class="title">{{title}}</h1>
            <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" ref="form" >
              <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
                <BaseInput name="deviceName" type="text" placeholder="What would you like to call this device" class="outlined" label="Device Name"/>
                <BaseInput name="IMEINumber" type="text" placeholder="Enter your device IMEI here" class="outlined" label="IMEI Number"/>
                <BaseInput name="SIMNumber" type="tel" placeholder="Enter your SIM number here" class="outlined" label="SIM Number"/>
                <BaseInput name="SIMInfo" type="link" placeholder="Enter your SIM information here" class="outlined" label="SIM Information"/>
                <div class="select-option flex flex-col gap-1 text-left">
                  <label for="vehicleId" class="text-xs font-bold">Vehicle</label>
                  <select name="vehicleId" v-model="vehicleId" class="cursor-pointer" required>
                    <option v-for="item in masterDataStore.vehicles" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select> 
                </div>
                <div class="select-option flex flex-col gap-1 text-left">
                  <label for="vehicleId" class="text-xs font-bold">GPS Model</label>
                  <select name="variantId" v-model="variantId" class="cursor-pointer" required>
                    <option v-for="item in masterDataStore.variants" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select> 
                </div>
                <TextArea name="notes" placeholder="Write notes for this device" class="outlined" label="Notes"></TextArea>
                <div class="flex justify-between gap-10"> 
                  <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
                  <BaseButton type="submit" class="filled__blue" :label="registerLabel" :loading="createDeviceIsLoading"  />
                </div>
              </form>
            </VeeForm>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  </div>
</template>

  
<script setup>
import BaseInput from '@/components/input/BaseInput.vue'
import TextArea from '@/components/input/TextArea.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import { addDeviceSchema } from '@/composable/devicesSchema'
import { useDevicesStore } from '@/stores/DevicesStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useMasterDataStore } from '@/stores/MasterDataStore'
 
  const props = defineProps({
      isOpen: Boolean,
      title: String
  })
  const vehicleId = ref('')
  const variantId = ref('')
  const schema = addDeviceSchema  
  const isError = ref(false)
  const modalActive = ref(false)
  const devicesStore = useDevicesStore()
  const { status, createDeviceIsLoading } = storeToRefs(useDevicesStore())
  const masterDataStore = useMasterDataStore()
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('REGISTER')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

  onMounted(() => {
    masterDataStore.getVariants()
    masterDataStore.getVehicles()
  })

  const onSubmit = async (values, { resetForm }) => {
    let newValues = values
    newValues.vehicleId = vehicleId.value
    newValues.variantId = variantId.value
    console.log(newValues)
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      await devicesStore.createDevices(newValues)
      modalActive.value = true
      if (status.value.state == true ) {
        isError.value = true
        setTimeout(closeNotification, 3000)
      } else {
        isError.value = false
        setTimeout(closeNotification, 3000)
        resetForm()
      }
      registerLabel.value = 'REGISTER'
      regButtonClick.value = 0
      devicesStore.loadDevices()
    }
  }

  const closeNotification = () => {
    modalActive.value = false
  }
  // Define custom events
  const emits = defineEmits(['close'])
  
  const form = ref(null)
  const target = ref(null)

  onClickOutside(target, () => {
    if (props.isOpen) {
      emits('close')
    }
  })

  function cancelForm() {
    cancelButtonClick.value = ++cancelButtonClick.value
    switch (cancelButtonClick.value) {
      case 1:
      cancelLabel.value = 'The entered data will be lost!'
        break;
      case 2:
      form.value.resetForm()
      emits('close')
      cancelButtonClick.value = 0
      cancelLabel.value = 'CANCEL'
        break;
    }
  }

  // onUnmounted(() => {
  //   devicesStore.loadDevices()
  // })


</script>
  
  <style scoped>

  .title {
    @apply text-left border-b-[1px] pb-[18px] text-[28px] font-normal text-[#8E8E93]
  }
  

  .message-wrapper {
    @apply flex items-center gap-2
  }
  
  .form-wrapper{
    @apply flex flex-col gap-6
  }

  
.modal {
  @apply
    fixed top-0 left-0 w-full h-full
    overflow-x-hidden overflow-y-auto
    bg-[#ABADAF]/20 z-10
}

.modal-inner {
  @apply 
    max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply 
    relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.select-option {
  @apply  px-3 py-2
          rounded-lg border border-[#D1D1D6]
} 

  
  </style>