<template>
  <div ref="mapContainer" class="map-container"></div>
  <div id="popup" title="myproject" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content">
    </div>
  </div>
  <form @submit.prevent="filterVehicle" class="absolute left-[70px] top-[72px] z-0 bg-white rounded-lg w-fit h-fit h-max-[1000px] shadow-2xl px-4 py-4 flex flex-col gap-2">
    <h1 class="text-left font-bold text-lg">Select Vehicle</h1>
    <select v-model="selectedVehicle" class="cursor-pointer">
      <option v-for="item in devicesList" :key="item.id" :value="item.IMEINumber">{{ item.deviceName }}</option>
    </select> 
    <div class="text-left mt-4 flex flex-col gap-2">
      <h2>From</h2>
      <div class="flex gap-6">
        <input type="date" name="startDate" id="startDate" v-model="startDate">
        <input type="time" name="startTime" id="startTime" v-model="startTime">
      </div>
    </div>
    <div class="text-left mt-4 flex flex-col gap-2">
      <h2>To</h2>
      <div class="flex gap-6">
        <input type="date" name="endDate" id="endDate" v-model="endDate">
        <input type="time" name="endTime" id="endTime" v-model="endTime">
      </div>
    </div>
    <BaseButton type="submit" class="filled__blue mt-4" label="Filter" />
  </form>
</template>

<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { ref, onMounted, computed } from 'vue'
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import LineString from 'ol/geom/LineString'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import { useDevicesStore } from '@/stores/DevicesStore'
import { storeToRefs } from 'pinia'
import distanceFilter from '@/composable/distanceFilter.js'
import Select from 'ol/interaction/Select'
import { pointerMove, singleClick } from 'ol/events/condition';

let map
let popupOverlay
let vectorSource
let coordinates
let lineString
let lineFeature
let vectorLayer
const mapContainer = ref(null)
const geoDataStore = useGeoDataStore()
const devicesStore = useDevicesStore()
const { deviceHistoryGeo } = storeToRefs(useGeoDataStore())
const { devicesList } = storeToRefs(useDevicesStore())
const selectedVehicle = ref({imei:null})
const startDate = ref(new Date().toLocaleDateString('en-CA'))
const tempStartTime = new Date();
tempStartTime.setHours(tempStartTime.getHours() - 1);
const startTime = ref(tempStartTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
const endDate = ref(new Date().toLocaleDateString('en-CA'))
const endTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))


const queryParams = ref({
  imei: selectedVehicle.value.imei,
  startTime: new Date(startDate.value + 'T' + startTime.value).toISOString(),
  endTime: new Date(endDate.value + 'T' + endTime.value).toISOString()
})


onMounted(async() => {
  await devicesStore.loadDevices()
  initializeMap()
})

function initializeMap() {
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      })
    ],
    view: new View({
      center: fromLonLat([118.015776,-2.600029]),
      zoom: 5,
      maxZoom: 16,
    }),
    controls:[]
  })

  popupOverlay = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })
  map.addOverlay(popupOverlay)
}


let minimumDistance = 10
const route = ref()

async function filterVehicle() {
  queryParams.value.imei = selectedVehicle.value
  queryParams.value.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.value.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  console.log(queryParams.value)
  console.log(queryParams.value)
  await geoDataStore.getHistoryDeviceGeo(queryParams.value)

  const filteredData = ref([])
  console.log(deviceHistoryGeo.value)
  filteredData.value = deviceHistoryGeo.value.filter(geo => geo.latitude != 0)
  route.value = distanceFilter.filter(minimumDistance,filteredData.value).route
  map.removeLayer(vectorLayer)
  addMarkersToMap('#2482E6',route.value)
  console.log(vectorLayer)
}


function addMarkersToMap(color, data) {
  vectorSource = new VectorSource();

  coordinates = data.map(item => fromLonLat([item.longitude, item.latitude]));

  lineString = new LineString(coordinates);

  lineFeature = new Feature({
    geometry: lineString,
  });

  lineFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: `${color}`, // Specify the desired line color
        width: 4, // Specify the desired line thickness
      }),
    })
  );
  vectorSource.addFeature(lineFeature);

  data.forEach((item, index) => {
    const { latitude, longitude } = item;
    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      value: item,
    });

    let markerStyle;
    if (index === 0) {
      // First marker
      markerStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'green' }),
          stroke: new Stroke({ color: 'white', width: 1 }),
        }),
      });
    } else if (index === data.length - 1) {
      // Last marker
      markerStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'white', width: 1 }),
        }),
      });
    } else {
      // Intermediate markers
      markerStyle = new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({ color: 'blue' }),
          // stroke: new Stroke({ color: 'white', width: 1 }),
        }),
      });
    }

    marker.setStyle(markerStyle);
    vectorSource.addFeature(marker);
  })

  vectorLayer = new VectorLayer({
    source: vectorSource,
  })

  map.addLayer(vectorLayer)

  map.getView().fit(lineString.getExtent(), {
    padding: [50, 50, 50, 50],
  })

  const selectInteraction = new Select({
    condition: pointerMove,
    style: null,
    layers: [vectorLayer],
  })

  selectInteraction.on('select', (event) => {
    const selectedFeatures = event.target.getFeatures()
    if (selectedFeatures.getLength() > 0) {
      const selectedFeature = selectedFeatures.item(0)
      const isLineString = selectedFeature.getGeometry().getType() === 'LineString'
      if (!isLineString) {
        console.log(selectedFeature.getProperties())
        let satellites = selectedFeature.get('value').satellites
        let latitude = selectedFeature.get('value').latitude
        let longitude = selectedFeature.get('value').longitude
        let time = selectedFeature.get('value')._time
        let popupContent = 'satellites: ' + satellites + '<br>' + 'lat, long: ' + latitude + ',' + longitude + '<br>' + 'device time : ' + time
        document.getElementById('popup').innerHTML = popupContent
        popupOverlay.setPosition(selectedFeature.getGeometry().getCoordinates())
        popupOverlay.getElement().style.display = 'block'
      } 
    } else {
      popupOverlay.setPosition(undefined)
    }
  })

  map.addInteraction(selectInteraction)
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh
}

.ol-popup {
    position: absolute;
    background-color: white;
    /*--webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));*/
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 180px;
    margin-bottom: 10px;
}
.ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
</style>
