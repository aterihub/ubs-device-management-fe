<template>
    <button v-bind="$attrs" :disabled="loading || disable" :class="{'button--loading' : loading}">
      <span class="button__text">{{label}}</span> 
      <!-- <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg> -->
    </button>
</template>

<script>
import { ref } from 'vue'

export default {
  props: [
    'disable',
    'loading',
    'label'
  ]
}
</script>

<style scoped>
button {
  @apply disabled:opacity-75 flex justify-center items-center relative w-full
          
}
.spinner {
  @apply animate-spin hidden
}

.loading .spinner {
  @apply flex 
}

.elevated {
  @apply bg-white rounded-md text-[#2482E6] p-2 rounded-md cursor-pointer text-sm font-medium justify-center items-center text-center shadow-md
  transition-colors duration-300
}
.elevated:hover {
  @apply bg-[#2482E6] text-white
  
}
.filled {
  @apply bg-[#FFEE58] rounded-md text-[#353535] p-2 cursor-pointer text-sm font-medium justify-center items-center text-center
  transition-colors duration-300 border-solid border-2 border-[#FFEE58]
}

.filled:hover {
  @apply bg-[#FFEE58]/70 
}

.filled__blue {
  @apply bg-[#2482E6] rounded-md text-white p-2 cursor-pointer text-sm font-medium justify-center items-center text-center
  transition-colors duration-300 border-solid border-2 border-[#2482E6]
}

.filled__blue:hover {
  @apply bg-[#2482E6]/70 
}
.filled__red {
  @apply bg-[#CF0A0A] rounded-md text-white p-2 cursor-pointer text-sm font-medium justify-center items-center text-center
  transition-colors duration-300 border-solid border-2 border-[#CF0A0A]
}

.filled__red:hover {
  @apply bg-[#CF0A0A]/70 
}

.filled-tonal {
  @apply bg-[#2482E6]/70 rounded-md p-2 cursor-pointer text-sm font-medium justify-center items-center text-center
  transition-colors duration-300
  
}
.outlined {
  @apply border-solid border-2 border-[#2482E6] rounded-md p-2 cursor-pointer text-sm font-medium justify-center items-center text-center
  transition-colors duration-300 text-[#2482E6] box-border
}

.outlined:hover {
  @apply bg-[#2482E6] text-white
}

.floating {
  @apply bg-[#2482E6]/70 rounded-md p-2 cursor-pointer text-sm font-medium justify-center items-center text-center shadow-md
  transition-colors duration-300
}
.grey {
  @apply bg-[#FFFFFF]/20 text-white hover:bg-[#d0d0d0]/20
          rounded-md py-4 cursor-pointer text-sm font-medium justify-center items-center text-center
          transition-colors duration-300 box-border
}

.red {
  @apply bg-[#EB5757]/80 text-white hover:bg-[#DA5858]/80
          rounded-md py-4 cursor-pointer text-sm font-medium justify-center items-center text-center
          transition-colors duration-300 box-border
}

.filled__softblue {
  @apply bg-[#A2ADB7] rounded-md text-white p-2 cursor-pointer text-sm font-medium justify-center items-center text-center
  transition-colors duration-300
}

.filled__softblue:hover {
  @apply bg-[#A2ADB7]/70 
}


.button--loading .button__text {
  visibility: hidden;
  opacity: 0;
}

.button--loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 4px solid transparent;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: button-loading-spinner 1s ease infinite;
}

@keyframes button-loading-spinner {
  from {
    transform: rotate(0turn);
  }
 
  to {
    transform: rotate(1turn);
  }
}
</style>