<template>
  <sideNav :isMapsActive="true" class="floating" />
  <div class="search-wrapper">
    <SearchBar class="floating" v-model="searchValue" @input="searchEntries" />
    </div>
    <FilterDropdown 
      :filterParams="filterParams"
      @selectedOptionsChanged="filterEntries"/>
    <div id="mapid"></div>
  </template>
  
  <script setup>
    import FilterDropdown from '@/components/dropdown/FilterDropdown.vue' 
    import SearchBar from '@/components/SearchBar.vue';
    import sideNav from '@/components/navigation/sideNav.vue'
    import leaflet from 'leaflet'
    import { onMounted } from 'vue';
    import { ref } from 'vue';
  
    //Maps Init
    let mymap
    const overlay = ref(null);
    let imageUrl = require('../../assets/img/map-overlay.jpg')
    let imageBounds = [[-6.226429, 106.809041], [-6.225930, 106.810474]];
  
    onMounted( async () => {
      // init map
      mymap = leaflet.map('mapid',{minZoom: 20.4, maxZoom: 30})
      // init map base layer
      // 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      // 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
      leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' , {
        maxZoom: 30,
        attribution: '© OpenStreetMap'
      }).addTo(mymap)
      // create overlay
      overlay.value = leaflet.imageOverlay(imageUrl, imageBounds).addTo(mymap)
      //bounds map view to overlay
      mymap.fitBounds(overlay.value.getBounds())
      
    })

    //Data filtering
    const filterParams = ref(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4', 'Item 4'])
    const filteredEntries = ref([]) 
    const searchedEntries = ref([]) 
    const searchValue = ref('')

    function filterEntries(selectedOptions) {
      filteredEntries.value = selectedOptions
    }

    function searchEntries() {
      searchedEntries.value = filterParams.value.filter((data)=> data.toLocaleLowerCase().match(searchValue.value.toLocaleLowerCase()))
      console.log(searchedEntries.value)
     }
  
  </script>
  
  <style scoped>
  #mapid {
    @apply 
    /* h-[280px] */
    /* sm:h-[355px]
    md:h-[437px]
    lg:h-[427px]
    xl:h-[505px]
    2xl:h-[560px] */
    w-full
    h-screen
    z-0
    /* w-[320px] 
    sm:w-[400px] 
    lg:w-[471px] 
    xl:w-[656px] 
    md:w-[420px] 
    2xl:w-[800px]  */
  }

  .search-wrapper {
    @apply
      z-10 w-[300px] h-[40px]
      fixed left-[100px] top-10 
  }



  </style>