<template>
  <div>
    <alert 
    :message ="status.message"
    :modalActive="modalActive"
    :isError="status.isError"
    @close="closeNotification" />
    <transition name="fade">
      <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
              <div class="flex flex-col gap-4">
                <h1 class="text-lg">Please verify the device before deleting it</h1>
                <div class="flex flex-col gap-2">
                  <h1 class="font-semibold">Name: {{ props.deviceInfo.name }}</h1>
                </div>
              </div>
              <div class="button-wrapper">
                <BaseButton type="button" class="filled__red" :label="delLabel" :loading="isLoading" @click="onSubmit(props.deviceInfo.id)" />
                <BaseButton type="button" class="filled__softblue" label="CANCEL" @click="closeModal" />
              </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</div>
</template>

  
<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { useMasterDataStore } from '@/stores/MasterDataStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

  const props = defineProps({
    isOpen: Boolean,
    deviceInfo: {
        type: Object,
        default: () => ({name: 'null', field: 'null', notes: 'null', id: 'null'})
      }
  })
  const isError = ref(false)
  const modalActive = ref(false)
  const masterDataStore = useMasterDataStore()
  const { status, isLoading } = storeToRefs(useMasterDataStore())
  const delLabel = ref('DELETE')
  const delButtonClick = ref(0)

  const onSubmit = async (id) => {
    delButtonClick.value = ++delButtonClick.value
    if (delButtonClick.value == 1) {
      delLabel.value = 'sure to remove this device?'
    }

    if (delButtonClick.value == 2) {
      await masterDataStore.deleteManufacturer(id)
      modalActive.value = true
      setTimeout(closeNotification, 3000)
      resetButton()
      closeModal()
      masterDataStore.getManufacturers()
    }
  }

  const closeNotification = () => {
    modalActive.value = false
  }
  // Define custom events
  const emits = defineEmits(['close'])
  
  function closeModal() {
    resetButton()
    emits('close')
  }
  const target = ref(null)

  onClickOutside(target, () => {
    if (props.isOpen) {
      console.log(props.deviceInfo)
      closeModal()
    }
  })

  function resetButton() {
    delLabel.value = 'DELETE'
    delButtonClick.value = 0
  }


</script>
  
  <style scoped>
  
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
    relative w-[600px] p-[40px] bg-white rounded-xl gap-[40px] flex flex-col
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

  .button-wrapper {
    @apply flex justify-between gap-8
}

  
  </style>