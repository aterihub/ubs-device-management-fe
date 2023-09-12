import { createRouter, createWebHistory } from 'vue-router'
// import { useLoadingStore } from '@/stores/LoadingStore'

// import LoginForm from '@/views/Auth/LoginFormNew.vue'
import MainReport from '@/views/Report/MainReport.vue'
import WitReport from '@/views/Report/WitReport.vue'
import quickWitReport from '@/views/Report/WitReport.vue'
import quickMtnReport from '@/views/Report/MtnReport.vue'
import MtnReport from '@/views/Report/MtnReport.vue'
import MainDashboard from '@/views/Realtime/MainDashboard.vue'
import MtnDashboard from '@/views/Realtime/MtnDashboard.vue'
import WitDashboard from '@/views/Realtime/WitDashboard.vue'
// import DashboardDetails from '@/views/Dashboard/TDashboardDetails.vue'
// import DeviceDetails from '@/views/Devices/DeviceDetails.vue'
// import ResetPassword from '@/views/Auth/ResetPassword.vue'
// import MainMap from '@/views/Map/MainMap.vue'
import NotFound from '@/views/error/NotFound.vue'
// import Setting from '@/views/Setting/Setting.vue'

const routes = [
  // { path: '/', name: 'Login Page', component: LoginForm, meta: { requiresAuth:false, title: 'Intellisense Fleet Management System - Login',  } },
  // { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { requiresAuth:false} },
  { path: '/realtime', name: 'MainDashboard', component: MainDashboard, meta: { freeAccess: true, requiresAuth:false }},
  { path: '/realtime/mtn', name: 'MtnDashboard', component: MtnDashboard, meta: { freeAccess: true, requiresAuth:false }},
  { path: '/realtime/wit', name: 'WitDashboard', component: WitDashboard, meta: { freeAccess: true, requiresAuth:false }},
  
  { path: '/report', name: 'MainReport', component: MainReport, meta: { freeAccess: true, requiresAuth:false }},
  { path: '/report/mtn/:floor/:tray/:device', name: 'quickMtnReport', component: quickMtnReport, props: true, meta: { freeAccess: true, requiresAuth:false }},
  { path: '/report/wit/:floor/:tray/:device', name: 'quickWitReport', component: quickWitReport, props: true, meta: { freeAccess: true, requiresAuth:false }},
  { path: '/report/wit', name: 'WitReport', component: WitReport, meta: { freeAccess: true, requiresAuth:false }},
  { path: '/report/mtn', name: 'MtnReport', component: MtnReport, meta: { freeAccess: true, requiresAuth:false }},
  // { path: '/devices/details/:id', name: 'Device Details', component: DeviceDetails, props: true, meta: { freeAccess: true, requiresAuth:false }},
  // { path: '/geolocation', name: 'MainMap', component: MainMap, meta: { freeAccess: true, requiresAuth:false } },
  // { path: '/setting', name: 'Setting', component: Setting, meta: { freeAccess: true, requiresAuth:false } },

  { path: '/:catchALL(.*)', name: 'NotFound', component: NotFound },
  { path: '/', redirect: '/realtime' },
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
})

router.beforeEach(async () => {
  document.title = 'UBS SCADA Devices Management'
  }) 

  //loading
// router.beforeEach(async (to, from, next) => {
//   const loadingStore = useLoadingStore()
//   loadingStore.startLoading()

//   // Wait for 500ms to simulate async operation 
//   await new Promise(resolve => setTimeout(resolve, 500))

//   loadingStore.stopLoading()
//   next()
// })

export default router