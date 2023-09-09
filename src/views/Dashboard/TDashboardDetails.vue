<template>

    <sideNav :isDataActive="true" />
    <div class="content">
      <div class="device-container">
        <h1 class="title"> Data Monitoring </h1>
        <div class="card-wrapper">
          <h1 class="text-xl text-left font-semibold mb-4"> General Data </h1>
          <div class="device-info bg-[#F7F7F7] rounded-lg w-full py-5 px-10 grid grid-cols-4">
            <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">IMEI Number:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.IMEINumber }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">GSMS ignal:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.GSMSignal }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Data Mode:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.dataMode }}</p>
              </div>
            </div>
            <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Speed:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.speed }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">External Voltage:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.externalVoltage }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Battery Voltage:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.batteryVoltage }}</p>
              </div>
            </div>
            <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Battery Current:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.batteryCurrent }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">GNSSS tatus:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.GNSSStatus }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">GNSS PDOP:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.GNSSPDOP }}</p>
              </div>
            </div>
            <div class="field-wrapper flex flex-col gap-3 sm:gap-6">
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Sleep Mode:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.sleepMode }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Ignition:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.ignition }}</p>
              </div>
              <div class="text-wrapper flex flex-col gap-2 text-left">
                <p class="text-[#353535]/60 text-sm">Movement:</p>
                <p class="text-[#353535] text-base">{{ devicesGeneralData.movement }}</p>
              </div>
            </div>
          </div>
        </div> 
        <div id="mapRoot"></div>
        <!-- <div class="card-wrapper">
          <h1 class="text-xl text-left font-semibold mb-4"> CAN Data </h1>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
            <DynamicCard v-for="(card,index) in numOfCard" :key="index" :id="props.id" :CANData="CANData[index]"
              @close="decCard()"  
              @updateParams="(avlID, dataID) => handleUpdateParams(index, avlID, dataID)"  />

            <DynamicCardDummy @click="incCard()" />
          </div>
        </div> -->
    </div>
    </div>
</template>
  
<script setup>
// import DynamicCardDummy from '@/components/card/DynamicCardDummy.vue'
// import DynamicCard from '@/components/card/DynamicCard.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import { ref, onBeforeMount, onUnmounted, onMounted } from 'vue'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import { useCANDataStore } from '@/stores/CANDataStore'
import { storeToRefs  } from 'pinia'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Icon, Style, Circle, Fill, Stroke  } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as ol from 'ol';
import LineString from 'ol/geom/LineString';
import { useRealtimeDataStore } from '@/stores/RealtimeDataStore'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const loading = ref(false)
const canDataStore = useCANDataStore()
const geoDataStore = useGeoDataStore()
const { deviceGeo, devicesGeneralData } = storeToRefs(useRealtimeDataStore())
const numOfCard = ref(0)
const CANData = ref([])
const avlParams = ref([])
const delay = require('delay')
const whileState = ref(true)
const markerLayer = ref()
const markerCoordinates = ref([0,0])
const map = ref()


// async function getLocation() {
//   await realtimeDataStore.getCoordinate(props.id)
//   console.log(realtimeDataStore.deviceCoordinate)
//   //add the features
//   const features = ref([]) 
//   features.value.push(
//       new ol.Feature({
//         geometry: new Point(fromLonLat([realtimeDataStore.deviceCoordinate.longitude, realtimeDataStore.deviceCoordinate.latitude])), // adjust the coordinates to match your marker
//         id: 2
//       })
//   )

//   markerLayer.value.getSource().clear()
//   markerLayer.value.getSource().addFeatures(features.value)
// }

// const updateMarker = async () => {
//   await realtimeDataStore.getCoordinate(props.id);
//   markerCoordinates.value = [
//     realtimeDataStore.deviceCoordinate.longitude,
//     realtimeDataStore.deviceCoordinate.latitude,
//   ]
//   console.log(markerCoordinates.value)
//   markerLayer.value.getSource().getFeatures()[0].getGeometry().setCoordinates(fromLonLat(markerCoordinates.value))
//   markerLayer.value.getSource().changed()
//   map.value.getView().setCenter(fromLonLat(markerCoordinates.value))
// };

// onBeforeMount( async () => {
//   loading.value = true
//   await realtimeDataStore.getGeneralData(props.id)
  
//   map.value = new Map({
//     target: 'mapRoot',
//     layers: [
//       new TileLayer({
//         source: new OSM()
//       })
//     ],
//     view: new View({
//       center:[0,0],
//       zoom: 14
//     })
//   })
//   const marker = new Feature({
//     geometry: new Point(fromLonLat(markerCoordinates.value)),
//   })
//   const markerStyle = new Style({
//     image: new Icon({
//       src: require('../../assets/img/marker.png'),
//       scale: 0.5,
//     }),
//   })
//   marker.setStyle(markerStyle)
//   const vectorSource = new VectorSource({
//     features: [marker],
//   })
//   markerLayer.value = new VectorLayer({
//     source: vectorSource,
//   })

//   map.value.addLayer(markerLayer.value)

//   console.log(devicesGeneralData.value)
//   loading.value = false
//   while (whileState.value) {
//     console.log(avlParams.value)
//     await realtimeDataStore.getGeneralData(props.id)
//     updateMarker()
//     await delay(3000)
//   }
// })

// async function handleUpdateParams(index,avlID, dataID) {
//   let temp = {[avlID] : dataID}
//   avlParams.value[index] = temp
//   console.log(avlParams.value)
//   while (whileState.value) {
//     const res = await canDataStore.getCANDatas(props.id, avlParams.value)
//     CANData.value = res.map((data) => { 
//       if (typeof(data.data[0]) === 'undefined') {
//         return 'No Data'
//       }
//       return data.data[0].decodeData
//     })
//     await delay(10000)
//   }
// }

// onUnmounted(() => {
//   whileState.value = false
// })



 
// function incCard() {
//   // inc.value = inc.value + 1
//   // numOfCard.value.push(`${inc.value}`)
//   // console.log(numOfCard.value)
//   numOfCard.value = numOfCard.value + 1
//   console.log(numOfCard.value)
// }
// function decCard(index) {
//   numOfCard.value = numOfCard.value - 1
//   console.log(numOfCard.value)
//   // numOfCard.value.splice(index,1)
//   avlParams.value.pop()
//   // console.log(numOfCard.value)
// }



//-------------
const queryParams = ref({
  imei: props.id
})
onMounted(() => {
  initializeMap();
  getDataFromBackend();
});

function initializeMap() {
  map.value = new Map({
    target: 'mapRoot',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 2,
    }),
  });
}

async function getDataFromBackend() {
  await geoDataStore.getLastDeviceGeo(queryParams.value)
  console.log(deviceGeo.value)
  const dummyData = [
    { lat: 0, long: 0 },
    { lat: 10, long: 10 },
    { lat: 20, long: 20 },
    { lat: 30, long: 30 }
  ];

  addMarkersToMap(dummyData);
}

function addMarkersToMap(data) {
  const vectorSource = new VectorSource();

  const coordinates = data.map(item => fromLonLat([item.long, item.lat]));

  const lineString = new LineString(coordinates);

  const lineFeature = new Feature({
    geometry: lineString,
  });

  vectorSource.addFeature(lineFeature);

  data.forEach(item => {
    const { lat, long } = item;
    const marker = new Feature({
      geometry: new Point(fromLonLat([long, lat])),
    });

    marker.setStyle(
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      })
    );

    vectorSource.addFeature(marker);
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.value.addLayer(vectorLayer);

  map.value.getView().fit(lineString.getExtent(), {
    padding: [50, 50, 50, 50],
  });
}
</script>

<style scoped>

#mapRoot {
  @apply w-full h-screen
}
.content {
  @apply w-full h-fit relative
}
.device-container {
  @apply 
    flex flex-col gap-9 p-[32px]
}
.title {
  @apply
    text-[28px] font-thin flex justify-start items-center text-[#353535] opacity-80
}
.card-wrapper {
  @apply
    flex flex-col 
}
.card {
  @apply 
  flex flex-col gap-4 w-fit
}

input {
  @apply
  p-3 font-medium bg-transparent focus:outline-none w-32 text-sm
  border-solid border rounded-lg

} 

input::placeholder {
  @apply text-sm font-medium text-[#9A9EA4] 
} 
  </style>