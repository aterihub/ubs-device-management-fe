<template>
  <div ref="mapContainer" class="map-container"></div>
  <div class="absolute left-[80px] top-[82px] bg-white rounded-lg w-fit h-fit h-max-[1000px] shadow-2xl px-4 py-4 flex flex-col gap-2">
    <h1 class="text-left font-bold text-lg">Select Vehicle</h1>
    <select v-model="selectedVehicle" class="cursor-pointer" @change="changeVehicle(selectedVehicle)">
      <option v-for="item in devicesList" :key="item.id" :value="item.IMEINumber">{{ item.deviceName }}</option>
    </select>
  </div>
  <div class="absolute right-[20px] top-[82px] bg-white rounded-lg w-fit h-fit h-max-[1000px] shadow-2xl px-4 py-4 flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h1 class="text-left font-bold text-lg">Vehicle Information</h1>
      <Indicator :status="deviceStatus.indicator"/>
    </div>
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">GSM Signal:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo.gsm_signal}}</h1>
    </div>    
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">Latitude:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo.latitude}}</h1>
    </div>    
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">Longitude:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo.longitude}}</h1>
    </div>    
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">Altitude:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo.altitude}}</h1>
    </div>     
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">Angle:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo.angle}}</h1>
    </div>   
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">Satellites:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo.satellites}}</h1>
    </div>    
    <div class="flex gap-2">
      <label for="batt" class="text-sm text-[#353535]/60">Time:</label>
      <h1 class="text-sm text-[#353535]">{{deviceGeo._time}}</h1>
    </div>    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted} from 'vue'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import { useDevicesStore } from '@/stores/DevicesStore'
import Icon from 'ol/style/Icon'
import { storeToRefs } from 'pinia'
import SignalIndicator from '@/components/SignalIndicator.vue'
import Indicator from '@/components/Indicator.vue'
import { useRealtimeDataStore } from '@/stores/RealtimeDataStore'

let map
let vectorSource
let marker
const mapContainer = ref(null)
const geoDataStore = useGeoDataStore()
const devicesStore = useDevicesStore()
const realtimeDataStore = useRealtimeDataStore()
const { deviceGeo } = storeToRefs(useGeoDataStore())
const { devicesList } = storeToRefs(useDevicesStore())
const { deviceStatus } = storeToRefs(useRealtimeDataStore())
const selectedVehicle = ref({imei:null, type:null})
let dataInterval

const queryParams = ref({
  imei: selectedVehicle.value.imei
})

onMounted( async () => {
  await devicesStore.loadDevices()
  selectedVehicle.value = devicesList.value[0].IMEINumber
  queryParams.value.imei = devicesList.value[0].IMEINumber
  initializeMap()
  dataInterval = setInterval(getCoordinates, 1000)
})  

onUnmounted( async () => {
  clearInterval(dataInterval)
})

function initializeMap() {
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 14,
    }),
    controls:[]
  })

  vectorSource = new VectorSource();
  map.addLayer(new VectorLayer({ source: vectorSource }));

  marker = new Feature({
    geometry: new Point(fromLonLat([0, 0])),
  });
  marker.setStyle(
    new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: 'red' }),
        stroke: new Stroke({ color: 'white', width: 2 }),
      }),
    })
  )
  vectorSource.addFeature(marker)
}

function addMarkersToMap(coordinate) {
  console.log(coordinate)
  marker.getGeometry().setCoordinates(coordinate);
  map.getView().setCenter(coordinate);  
}


function changeVehicle(selectedVehicle) {
  queryParams.value.imei = selectedVehicle
 }


let isRequestPending = false

async function getCoordinates() {
  if (isRequestPending) {
    return
  }
  isRequestPending = true;
  await geoDataStore.getLastDeviceGeo(queryParams.value)
  await realtimeDataStore.getDeviceStatus(selectedVehicle.value)
  
  let angle = deviceGeo.value.angle
  let angleInRadians = (angle * Math.PI) / 180; //
  marker.setStyle(
    new Style({
      image: new Icon({
        src: require('../../assets/icon/car-icon.png'), 
        scale: 0.2,
        rotation: angleInRadians
      }),
    })
  )
  addMarkersToMap(fromLonLat([deviceGeo.value.longitude, deviceGeo.value.latitude]))
  isRequestPending = false
}

// const selectInteraction = new Select({
//     condition: pointerMove,
//     style: null,
//     layers: [vectorLayer], 
//   })
  
//   selectInteraction.on('select', (event) => {
//     const selectedFeatures = event.target.getFeatures()
//     if (selectedFeatures.getLength() > 0) {
//       const selectedFeature = selectedFeatures.item(0)
//       const isLineString = selectedFeature.getGeometry().getType() === 'LineString'
//       if (!isLineString) {
//         let satellites = selectedFeature.get('value').satellites
//         let latitude = selectedFeature.get('value').latitude
//         let longitude = selectedFeature.get('value').longitude
//         let time = selectedFeature.get('value')._time
//         let popupContent = 'satellites: ' + satellites + '<br>' + 'lat, long: ' + latitude + ',' + longitude + '<br>' + 'device time : ' + time
//         document.getElementById('popup').innerHTML = popupContent
//         popupOverlay.setPosition(selectedFeature.getGeometry().getCoordinates())
//         popupOverlay.getElement().style.display = 'block'
//       } 
//     } else {
//       popupOverlay.setPosition(undefined)
//     }
//   })
// map.addInteraction(selectInteraction)

// async function getCoordinates() {
//   if (isRequestPending) {
//     return;
//   }
//   isRequestPending = true;
//   await geoDataStore.getLastDeviceGeo(selectedVehicle.value.type, queryParams.value)
//   if (deviceGeo.value.satellites >= 7 ) {
//     marker.setStyle(
//     new Style({
//       image: new Circle({
//         radius: 10,
//         fill: new Fill({ color: '#2482E6' }),
//         stroke: new Stroke({ color: 'white', width: 4 }),
//       }),
//     })
//   )
//   } else {
//     marker.setStyle(
//     new Style({
//       image: new Circle({
//         radius: 10,
//         fill: new Fill({ color: 'red' }),
//         stroke: new Stroke({ color: 'white', width: 4 }),
//       }),
//     })
//   )
//   }
//   addMarkersToMap(fromLonLat([deviceGeo.value.longitude, deviceGeo.value.latitude]))
//   isRequestPending = false
// }
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh
}


</style>
