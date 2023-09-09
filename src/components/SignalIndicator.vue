<template>
    <div class="signal">
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="bar-1" y="20" width="3" height="6" rx="1.5" :fill="barFill(1)"/>
        <rect class="bar-2" x="6" y="15" width="3" height="11" rx="1.5" :fill="barFill(2)"/>
        <rect class="bar-3" x="12" y="10" width="3" height="16" rx="1.5" :fill="barFill(3)"/>
        <rect class="bar-4" x="18" y="5" width="3" height="21" rx="1.5" :fill="barFill(4)"/>
        <rect class="bar-5" x="24" width="3" height="26" rx="1.5" :fill="barFill(5)"/>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { watchEffect } from 'vue';
  
  const props = defineProps({
    status: Number,
  });

  function barFill(barIndex) {
    const activeColor = '#34C759';
    const inactiveColor = '#D1D1D6';
    return props.status >= barIndex ? activeColor : inactiveColor;
  }
  
  watchEffect(() => {
    console.log('status changed:', props.status);
  });
  </script>
  