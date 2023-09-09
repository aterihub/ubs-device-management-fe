<template>
//<img src="@/assets/map/map-idrosat.png" class="invisible absolute">
//<img src="@/assets/map/map-ev.png" class="invisible absolute">
<div class="background"></div>
<loading :loading="loadingAll" />
<div class="map-container">
  <sidebar 
    :noSocial="true" 
    :backOn="true" 
    />
  <div class="device-container">
    <deviceCard 
      :small=true
      :content="newData" />
    <img class="w-40" src="@/assets/map.png">
  </div>
  <div class="content">
    <intellisenseTitle :title="title"/>
    <div class="main">
      <div id="mapid"></div>
      <div class="button-wrapper">
        <IveButton type="button" class="filled__blue mt-6" label="Add new dispenser" @click="toggleMenu"/>
      </div>
    </div>
  </div>
</div>
<sideBarVue :isExpand="isExpand" :evList="evList" :deviceData="devicesStore.deviceData" :formData="devicesStore.deviceGeo" />
</template>

<script setup>
import { useDataStore } from '@/stores/DataStore';
import { useDevicesStore } from '@/stores/DevicesStore'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent,  computed,  onMounted,  ref, onBeforeMount } from '@vue/runtime-core'
import leaflet from 'leaflet'
import IveButton from '@/components/button/BaseButton.vue'
import sideBarVue from '@/components/navigation/sideBar.vue'

  //props
  const props = defineProps({
    id: String
  })

  const isExpand = ref(false)
  const toggleMenu = () => {
    isExpand.value = !isExpand.value
  }
  //asynchronus component
  const deviceCard = defineAsyncComponent(
    () => import('@/components/cards/deviceCard.vue'),
  )
  //state
  const devicesStore = useDevicesStore()
  const { status, isLoading } = storeToRefs(useDevicesStore())
  const dataStore = useDataStore()
  const newData = computed(() => {
      return [devicesStore.deviceData]
    })
  const title = ref()
  const loadingAll = ref(true)
  loadingAll.value=true
  const deviceData = ref()
  const deviceId = ref()
  const evList = ref([])

  const evConfigParams = ref({
    fields: 'S2000,S2001,S2002,S2003,S2004,S2005,S2006,S2007,S2008,S2009,S2010,S2011,S2012,S2013,S2014,S2015,S2016,S2017,S2018,S2019,S2020,S2021,S2022,S2023,S2024,S2025,S2026,S2027,S2028,S2029,S2030,S2031,S2032,S2033,S2034,S2035,S2036,S2037,S2038,S2039,S2040,S2041,S2042,S2043,S2044,S2045,S2046,S2047,S2048,S2049,S2050,S2051,S2052,S2053,S2054,S2055,S2056,S2057,S2058,S2059,S2060,S2061,S2062,S2063,S2064,S2065,S2066,S2067,S2068,S2069,S2070,S2071,S2072,S2073,S2074,S2075,S2076,S2077,S2078,S2079,S2080,S2081,S2082,S2083,S2084,S2085,S2086,S2087,S2088,S2089,S2090,S2091,S2092,S2093,S2094,S2095,S2096,S2097,S2098,S2099,S2100,S2101,S2102,S2103,S2104,S2105,S2106,S2107,S2108,S2109,S2110,S2111,S2112,S2113,S2114,S2115,S2116,S2117,S2118,S2119,S2120,S2121,S2122,S2123,S2124,S2125,S2126,S2127,S2128,S2129,S2130,S2131,S2132,S2133,S2134,S2135,S2136,S2137,S2138,S2139,S2140,S2141,S2142,S2143,S2144,S2145,S2146,S2147,S2148,S2149,S2150,S2151,S2152,S2153,S2154,S2155,S2156,S2157,S2158,S2159,S2160,S2161,S2162,S2163,S2164,S2165,S2166,S2167,S2168,S2169,S2170,S2171,S2172,S2173,S2174,S2175,S2176,S2177,S2178,S2179,S2180,S2181,S2182,S2183,S2184,S2185,S2186,S2187,S2188,S2189,S2190,S2191,S2192,S2193,S2194,S2195,S2196,S2197,S2198,S2199,S2200,S2201,S2202,S2203,S2204,S2205,S2206,S2207,S2208,S2209,S2210,S2211,S2212,S2213,S2214,S2215,S2216,S2217,S2218,S2219,S2220,S2221,S2222,S2223,S2224,S2225,S2226,S2227,S2228,S2229,S2230,S2231,S2232,S2233,S2234,S2235,S2236,S2237,S2238,S2239,S2240,S2241,S2242,S2243,S2244,S2245,S2246,S2247,S2248,S2249,S2250,S2251,S2252,S2253,S2254,S2255,S2256,S2257,S2258,S2259,S2260,S2261,S2262,S2263,S2264,S2265,S2266,S2267,S2268,S2269,S2270,S2271,S2272,S2273,S2274,S2275,S2276,S2277,S2278,S2279,S2280,S2281,S2282,S2283,S2284,S2285,S2286,S2287,S2288,S2289,S2290,S2291,S2292,S2293,S2294,S2295,S2296,S2297,S2298,S2299,S2300,S2301,S2302,S2303,S2304,S2305,S2306,S2307,S2308,S2309,S2310,S2311,S2312,S2313,S2314,S2315,S2316,S2317,S2318,S2319,S2320,S2321,S2322,S2323,S2324,S2325,S2326,S2327,S2328,S2329,S2330,S2331,S2332,S2333,S2334,S2335,S2336,S2337,S2338,S2339,S2340,S2341,S2342,S2343,S2344,S2345,S2346,S2347,S2348,S2349,S2350,S2351,S2352,S2353,S2354,S2355,S2356,S2357,S2358,S2359,S2360,S2361,S2362,S2363,S2364,S2365,S2366,S2367,S2368,S2369,S2370,S2371,S2372,S2373,S2374,S2375,S2376,S2377,S2378,S2379,S2380,S2381,S2382,S2383,S2384,S2385,S2386,S2387,S2388,S2389,S2390,S2391,S2392,S2393,S2394,S2395,S2396,S2397,S2398,S2399,S2400,S2401,S2402,S2403,S2404,S2405,S2406,S2407,S2408,S2409,S2410,S2411,S2412,S2413,S2414,S2415,S2416,S2417,S2418,S2419,S2420,S2421,S2422,S2423,S2424,S2425,S2426,S2427,S2428,S2429,S2430,S2431,S2432,S2433,S2434,S2435,S2436,S2437,S2438,S2439,S2440,S2441,S2442,S2443,S2444,S2445,S2446,S2447,S2448,S2449,S2450,S2451,S2452,S2453,S2454,S2455,S2456,S2457,S2458,S2459,S2460,S2461,S2462,S2463,S2464,S2465,S2466,S2467,S2468,S2469,S2470,S2471,S2472,S2473,S2474,S2475,S2476,S2477,S2478,S2479,S2480,S2481,S2482,S2483,S2484,S2485,S2486,S2487,S2488,S2489,S2490,S2491,S2492,S2493,S2494,S2495,S2496,S2497,S2498,S2499,S2500,S2501,S2502,S2503,S2504,S2505,S2506,S2507,S2508,S2509,S2510,S2511,S2512,S2513,S2514,S2515,S2516,S2517,S2518,S2519,S2520,S2521,S2522,S2523,S2524,S2525,S2526,S2527,S2528,S2529,S2530,S2531,S2532,S2533,S2534,S2535,S2536,S2537,S2538,S2539,S2540,S2541,S2542,S2543,S2544,S2545,S2546,S2547,S2548,S2549,S2550,S2551,S2552,S2553,S2554,S2555,S2556,S2557,S2558,S2559,S2560,S2561,S2562,S2563,S2564,S2565,S2566,S2567,S2568,S2569,S2570,S2571,S2572,S2573,S2574,S2575,S2576,S2577,S2578,S2579,S2580,S2581,S2582,S2583,S2584,S2585,S2586,S2587,S2588,S2589,S2590,S2591,S2592,S2593,S2594,S2595,S2596,S2597,S2598,S2599,S2600,S2601,S2602,S2603,S2604,S2605,S2606,S2607,S2608,S2609,S2610,S2611,S2612,S2613,S2614,S2615,S2616,S2617,S2618,S2619,S2620,S2621,S2622,S2623,S2624,S2625,S2626,S2627,S2628,S2629,S2630,S2631,S2632,S2633,S2634,S2635,S2636,S2637,S2638,S2639,S2640,S2641,S2642,S2643,S2644,S2645,S2646,S2647,S2648,S2649,S2650,S2651,S2652,S2653,S2654,S2655,S2656,S2657,S2658,S2659,S2660,S2661,S2662,S2663,S2664,S2665,S2666,S2667,S2668,S2669,S2670,S2671,S2672,S2673,S2674,S2675,S2676,S2677,S2678,S2679,S2680,S2681,S2682,S2683,S2684,S2685,S2686,S2687,S2688,S2689,S2690,S2691,S2692,S2693,S2694,S2695,S2696,S2697,S2698,S2699,S2700,S2701,S2702,S2703,S2704,S2705,S2706,S2707,S2708,S2709,S2710,S2711,S2712,S2713,S2714,S2715,S2716,S2717,S2718,S2719,S2720,S2721,S2722,S2723,S2724,S2725,S2726,S2727,S2728,S2729,S2730,S2731,S2732,S2733,S2734,S2735,S2736,S2737,S2738,S2739,S2740,S2741,S2742,S2743,S2744,S2745,S2746,S2747,S2748,S2749,S2750,S2751,S2752,S2753,S2754,S2755,S2756,S2757,S2758,S2759,S2760,S2761,S2762,S2763,S2764,S2765,S2766,S2767,S2768,S2769,S2770,S2771,S2772,S2773,S2774,S2775,S2776,S2777,S2778,S2779,S2780,S2781,S2782,S2783,S2784,S2785,S2786,S2787,S2788,S2789,S2790,S2791,S2792,S2793,S2794,S2795,S2796,S2797,S2798,S2799,S2800,S2801,S2802,S2803,S2804,S2805,S2806,S2807,S2808,S2809,S2810,S2811,S2812,S2813,S2814,S2815,S2816,S2817,S2818,S2819,S2820,S2821,S2822,S2823,S2824,S2825,S2826,S2827,S2828,S2829,S2830,S2831,S2832,S2833,S2834,S2835,S2836,S2837,S2838,S2839,S2840,S2841,S2842,S2843,S2844,S2845,S2846,S2847,S2848,S2849,S2850,S2851,S2852,S2853,S2854,S2855,S2856,S2857,S2858,S2859,S2860,S2861,S2862,S2863,S2864,S2865,S2866,S2867,S2868,S2869,S2870,S2871,S2872,S2873,S2874,S2875,S2876,S2877,S2878,S2879,S2880,S2881,S2882,S2883,S2884,S2885,S2886,S2887,S2888,S2889,S2890,S2891,S2892,S2893,S2894,S2895,S2896,S2897,S2898,S2899,S2900,S2901,S2902,S2903,S2904,S2905,S2906,S2907,S2908,S2909,S2910,S2911,S2912,S2913,S2914,S2915,S2916,S2917,S2918,S2919,S2920,S2921,S2922,S2923,S2924,S2925,S2926,S2927,S2928,S2929,S2930,S2931,S2932,S2933,S2934,S2935,S2936,S2937,S2938,S2939,S2940,S2941,S2942,S2943,S2944,S2945,S2946,S2947,S2948,S2949,S2950,S2951,S2952,S2953,S2954,S2955,S2956,S2957,S2958,S2959,S2960,S2961,S2962,S2963,S2964,S2965,S2966,S2967,S2968,S2969,S2970,S2971,S2972,S2973,S2974,S2975,S2976,S2977,S2978,S2979,S2980,S2981,S2982,S2983,S2984,S2985,S2986,S2987,S2988,S2989,S2990,S2991,S2992,S2993,S2994,S2995,S2996,S2997,S2998,S2999,S3000,S3001,S3002,S3003,S3004,S3005,S3006,S3007,S3008,S3009,S3010,S3011,S3012,S3013,S3014,S3015,S3016,S3017,S3018,S3019,S3020,S3021,S3022,S3023,S3024,S3025,S3026,S3027,S3028,S3029,S3030,S3031,S3032,S3033,S3034,S3035,S3036,S3037,S3038,S3039,S3040,S3041,S3042,S3043,S3044,S3045,S3046,S3047,S3048,S3049,S3050,S3051,S3052,S3053,S3054,S3055,S3056,S3057,S3058,S3059,S3060,S3061,S3062,S3063,S3064,S3065,S3066,S3067,S3068,S3069,S3070,S3071,S3072,S3073,S3074,S3075,S3076,S3077,S3078,S3079,S3080,S3081,S3082,S3083,S3084,S3085,S3086,S3087,S3088,S3089,S3090,S3091,S3092,S3093,S3094,S3095,S3096,S3097,S3098,S3099,S3100,S3101,S3102,S3103,S3104,S3105,S3106,S3107,S3108,S3109,S3110,S3111,S3112,S3113,S3114,S3115,S3116,S3117,S3118,S3119,S3120,S3121,S3122,S3123,S3124,S3125,S3126,S3127,S3128,S3129,S3130,S3131,S3132,S3133,S3134,S3135,S3136,S3137,S3138,S3139,S3140,S3141,S3142,S3143,S3144,S3145,S3146,S3147,S3148,S3149,S3150,S3151',
    measurement: 'EVCONFIG',
    device_code: null
  })

  async function fillTableData() {
    let evIndex = 2000
    evList.value = []
    let i = 0
    for (let iFor = 0; iFor < dataStore.evConfigLength / 5; iFor++) {
      if (dataStore.evConfig.hasOwnProperty('S' + evIndex)) {
        if (dataStore.evConfig['S' + evIndex] !== "FFFFFF") {
          let obj = {
            id: i,
            ev: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + evIndex],
            lat: '0',
            long:'0'
          }
          evList.value.push(obj)
          i++
        }
      } 
      evIndex += 6
    }
  }

  //maps
  let mymap
  let latlong = ref([])

  let idroIcon = leaflet.icon({
    iconUrl: require('../../assets/map/map-idrosat.png'),
    iconSize: [60, 60],
    // iconAnchor: [22, 94],
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  });
  let evIcon = leaflet.icon({
    //iconUrl: '/img/map-ev.d602f09d.png',
    iconUrl: require('../../assets/map/map-ev.png'),
    iconSize: [40, 40],
    // iconAnchor: [22, 94],
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  });

  function onClick(e) {alert(this.getLatLng());}

  async function getEvGeo() {
    await devicesStore.loadDeviceGeo(devicesStore.deviceData.code)
    console.log(devicesStore.deviceGeo)
    devicesStore.deviceGeo.map((valve) => {
      leaflet.marker([valve.latitude, valve.longitude], {icon:evIcon}).addTo(mymap)
        .bindPopup(`EV : ${valve.ev_serial}`)
      let newObj = {
        lat : valve.latitude,
        long : valve.longitude
      }
      latlong.value.push(newObj)
    })
  }

  onMounted( async () => {
    let isIdrosatCoordinateValid = false
    let coordinate
    setTimeout(loadingAll.value = false, 10000)

    await devicesStore.loadDevice(props.id)
    if (devicesStore.deviceData.coordinate.includes(',')) {
      coordinate = devicesStore.deviceData.coordinate.split(',')
      isIdrosatCoordinateValid = true
    } else {
      isIdrosatCoordinateValid = false
    }

    navigator.geolocation.getCurrentPosition((position) => {
      if(isIdrosatCoordinateValid){
        mymap = leaflet.map('mapid').setView([coordinate[0], coordinate[1]], 16);
      } else {
        mymap = leaflet.map('mapid').setView([position.coords.latitude, position.coords.longitude], 16);
      }
      leaflet.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' , {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(mymap);
    });

    await devicesStore.loadDevice(props.id) // naha ieu dihapus icon idrosat ga muncul ey, wkwk, padahal coordinate yang dipake di marker dalem if di bawah ini pake nya dari const coordinate atas
    getEvGeo()
    //if (devicesStore.deviceData.coordinate.includes(',')) {
    if (isIdrosatCoordinateValid) {
      //const coordinate = devicesStore.deviceData.coordinate.split(',')
      leaflet.marker([coordinate[0], coordinate[1]], {icon:idroIcon}).addTo(mymap)
        .bindPopup(devicesStore.deviceData.name)
    }
    deviceData.value = devicesStore.deviceData
    evConfigParams.value.device_code = devicesStore.deviceData.code
    deviceId.value = props.id
    title.value = 'Idrosat:' + devicesStore.deviceData.name
    await dataStore.getLastEvConfig(evConfigParams.value)
    fillTableData()
    loadingAll.value = false
  })


  onBeforeMount( async () => {
    await devicesStore.loadDevice(props.id)
  })

  

</script>


<style scoped>
.background {
  @apply 
  bg-[#99D2E2] fixed h-screen w-screen z-0
}
.map-container {
  @apply 
    relative flex flex-col 
    px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px]
}
#mapid {
  @apply 
  h-[280px]
  sm:h-[355px]
  md:h-[437px]
  lg:h-[427px]
  xl:h-[505px]
  2xl:h-[560px]
  w-full
  z-40
  /* w-[320px] 
  sm:w-[400px] 
  lg:w-[471px] 
  xl:w-[656px] 
  md:w-[420px] 
  2xl:w-[800px]  */
}
.main {
  @apply flex flex-col w-full justify-center items-center relative
}
.device-container {
  @apply 
    flex sm:flex-col fixed items-end sm:items-center gap-2
    bottom-0 left-4
    pb-4 sm:pb-8
}
.device-container img {
  @apply 
    w-[40px] h-[40px] 
    sm:w-[60px] sm:h-[60px]
    md:w-[70px] md:h-[70px]
    lg:w-[80px] lg:h-[80px]
    xl:w-[100px] xl:h-[100px]
    2xl:w-[130px] 2xl:h-[130px]
    transition-all ease-in-out duration-300
}

.content {
  @apply 
    flex flex-col justify-center
    gap-2
    w-full
    sm:gap-4
    sm:my-[20px] 
}


input[type=text], input[type=password], input[type=number] {
  @apply pl-2 rounded w-10 md:w-20 py-2
}

.button-wrapper {
  @apply mt-2 flex
}

</style>