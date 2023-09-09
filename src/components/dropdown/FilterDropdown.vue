<template>
    <div 
      class="dropdown-wrapper"
      :class="{'active': isOpen}"
      >
      <div class="dropdown">
        <button class="dropdown-title" @click="isOpen = !isOpen">
          Filter
        </button>
        <div class="dropdown-menu" :class="{ 'show': isOpen }">
          <div class="dropdown-item">
            <input id="selectAll" type="checkbox" v-model="selectAll" @change="toggleSelectAll" /> 
            <label for="selectAll">
              Select All
            </label>
          </div>
          <div class="dropdown-item" v-for="(item, index) in filterParams" :key="index" @change="postFilter()">
            <label class="cursor-pointer">
              <input type="checkbox" :value="item" v-model="selectedOptions" />
              {{ item }}
            </label>   
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, defineEmits} from 'vue';
import { onUnmounted } from 'vue';


//props
const props = defineProps({
   filterParams: null
 })

const selectedOptions = ref([]);
const isOpen = ref(false);
const selectAll = ref(false)


function handleOutsideClick(event) {
  if (!event.target.closest('.dropdown')) {
    isOpen.value = false
  }
}

// Close dropdown when clicking outside of it
window.addEventListener('click', handleOutsideClick)

// Remove event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick)
})

function toggleSelectAll() {
  if (selectAll.value) {
    selectedOptions.value = props.filterParams
  } else {
    selectedOptions.value = []
  }
  postFilter()
}

// Define custom events
const emits = defineEmits(['selectedOptionsChanged'])


function postFilter() {
  emits('selectedOptionsChanged', selectedOptions.value)
}




</script>

<style scoped>
.dropdown-wrapper{
  box-shadow: 0px 0px 11px 3px rgba(0, 0, 0, 0.19);
  @apply
    flex flex-col fixed z-20
    h-[40px]
    p-2 bg-[#2482E6] rounded-[10px]
    right-10 top-10 
    transition-all duration-500 ease-in-out
}

.active {
  @apply
    h-[400px]
    overflow-auto
}

.dropdown-title {
  @apply 
      flex justify-center items-center
      w-[150px] bg-white rounded-md cursor-pointer
      right-10 top-10 mb-2
      text-base font-semibold text-[#2482E6]
}


.dropdown-menu {
  @apply
  invisible flex flex-col gap-2
}

.dropdown-item {
  @apply 
    flex
    h-9 py-2 rounded-md opacity-80 justify-start items-center p-2 gap-2
    bg-white text-[#353535] font-semibold
}

.show {
  @apply
    visible
}


.dropdown-wrapper::-webkit-scrollbar {
  @apply
   w-[2px]
}

.dropdown-wrapper::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  @apply
  rounded-full
}

</style>
  