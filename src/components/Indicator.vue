<template>
  <!-- <div class="indicator" 
  :class="status? 'indicator-on' : 'indicator-off'">
  </div> -->
  <div class="relative flex h-3 w-3">
    <span class="absolute inline-flex h-full w-full rounded-full opacity-75" :class="getIndicatorClass(status)"></span>
    <span class="relative inline-flex rounded-full h-3 w-3" :class="getStatusClass(status)"></span>
  </div> 
</template>

<script>
export default {
  props:
  [ 'status' ],
  methods: {
    getIndicatorClass(status) {
      if (status === 1) {
        return 'indicator-on';
      } else if (status === 0) {
        return 'indicator-off';
      } else if (status === -1) {
        return 'indicator-error';
      }
      // You can add more conditions if needed
    },
    getStatusClass(status) {
      if (status === 1) {
        return 'status-on';
      } else if (status === 0) {
        return 'status-off';
      } else if (status === -1) {
        return 'status-error';
      }
      // You can add more conditions if needed
    }
  }
}
</script>



<style scoped>
.indicator {
  @apply w-2 h-2 box-border rounded-full
}
.indicator-on {
  @apply animate-ping bg-green-400
}
.indicator-off {
  box-shadow: 0px 0px 4px 1px #C0C0C0, inset 0px 0px 7px #C0C0C0;
  background:#C7C7C7;
  border: 1px solid #C7C7C7;
}

.indicator-error {
  @apply animate-ping bg-red-500

}
.status-on {
  @apply bg-green-500
}
.status-off {
  @apply bg-[#C7C7C7]
}
.status-error {
  @apply bg-red-500
}
</style>