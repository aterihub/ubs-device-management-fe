<template>
  <sideNav :isReportActive="true" />
  <div class="content">
    <div class="device-container">
      <h1 class="title">Devices Performace Dashboard</h1>
      <div class="grid grid-cols-6 gap-4">
        <router-link :to="{name: 'MtnReport'}" class="card">
          <h1 class="text-lg font-semibold">MTN Devices</h1>
        </router-link>
        <router-link :to="{name: 'WitReport'}" class="card">
          <h1 class="text-lg font-semibold">WIT Devices</h1>
        </router-link>
      </div>
    </div>
  </div> 
</template>
  
<script setup>

import sideNav from '@/components/navigation/sideNav.vue'

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
    text-[28px] font-bold flex justify-start items-center text-[#3A3A3A]
}
.card-wrapper {
  @apply
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 
}
.card {
  @apply 
    rounded-2xl bg-white
    flex flex-col p-10 text-left gap-2
    border border-[#3A3A3A]/20
}

.card:hover {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  transform: translateY(-5px);
  @apply transition-all cursor-pointer

}

  </style>