<template>
  <div class="absolute left-0 top-0 w-full h-screen bg-black flex flex-col justify-center items-center gap-[40px]">
    <img class="w-[400px]" src="@/assets/img/404.png" alt="" srcset="">
    <img class="absolute" src="@/assets/img/crossline.png" alt="" srcset="">
    <div>
      <h1 class="text-[48px] text-white">SORRY, THERE’S</h1>
      <h1 class="text-[48px] text-[#2482E6] ">NOTHING HERE</h1>
    </div>
    <div class="w-[200px]">
      <BaseButton type="button" class="filled__blue" label="GO HOME" @click="goHome()" />
    </div>
  </div>
</template>


<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import router from '@/router';
  
  function goHome() {
    // router.push({ name: 'Login Page' });
  }
</script>
