<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:100vh">

  <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />
  <ol-zoom-control />
  <ol-attribution-control/>
  <ol-image-layer>
    <ol-source-image-static :url="imgUrl" :imageSize="size" :imageExtent="extent" :projection="projection" ></ol-source-image-static>
  </ol-image-layer>
  </ol-map>
</template>
  
<script setup>
import { ref } from 'vue';
import Heatmap from 'ol/layer/Heatmap.js';
  
  const zoom = ref(2.6)
  const rotation = ref(0)
  const size = ref([1400, 800])
  const center = ref([size.value[0] / 2, size.value[1] / 2])
  const extent = ref([0, 0, ...size.value])
  
  const projection = ref({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent,
  });

  let imgUrl = require('../../assets/img/map-overlay.jpg')
  
</script>

<style scoped>

</style>