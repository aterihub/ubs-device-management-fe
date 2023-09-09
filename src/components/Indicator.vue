<template>
  <!-- <div class="indicator" 
  :class="status? 'indicator-on' : 'indicator-off'">
  </div> -->
  <div class="relative flex h-3 w-3">
    <span class="absolute inline-flex h-full w-full rounded-full opacity-75" :class="status? 'indicator-on' : 'indicator-off'"></span>
    <span class="relative inline-flex rounded-full h-3 w-3" :class="status? 'status-on' : 'status-off'"></span>
  </div> 
</template>

<script>
  export default {
    props:
    [ 'status' ]
  }
</script>



<style scoped>
.indicator {
  @apply w-2 h-2 box-border rounded-full
}
.indicator-on {
  @apply animate-ping bg-sky-400
}
.indicator-off {
  box-shadow: 0px 0px 4px 1px #C0C0C0, inset 0px 0px 7px #C0C0C0;
  background:#C7C7C7;
  border: 1px solid #C7C7C7;
}
.status-on {
  @apply bg-sky-500
}
.status-off {
  @apply bg-[#C7C7C7]
}
</style>