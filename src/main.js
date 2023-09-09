import { createApp } from 'vue'
import Vue from "vue";
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

import router from './router'
import lottie from 'vue-lottie'
import loading from '@/components/loading.vue'
import modal from './components/modal/Modal.vue'
import { defineAsyncComponent } from 'vue'

import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import JsonCSV from 'vue-json-csv'
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(OpenLayersMap)

app.mount('#app')

app.component('alert', defineAsyncComponent(() =>
  import('@/components/alert/BaseAlert.vue')
))

app
.component('EasyDataTable', Vue3EasyDataTable)
.component('Breadcrumbs', Breadcrumbs)
.component('modal', modal)
.component('lottie', lottie)
.component('loading', loading)
.component('downloadCsv', JsonCSV)
// .component('VueSlider', VueSlider)



