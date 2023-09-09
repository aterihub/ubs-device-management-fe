import { createRouter, createWebHistory } from 'vue-router'
// import { useLoadingStore } from '@/stores/LoadingStore'

// import LoginForm from '@/views/Auth/LoginFormNew.vue'
import DevicesList from '@/views/Devices/DevicesList.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
// import DashboardDetails from '@/views/Dashboard/TDashboardDetails.vue'
// import DeviceDetails from '@/views/Devices/DeviceDetails.vue'
// import ResetPassword from '@/views/Auth/ResetPassword.vue'
// import MainMap from '@/views/Map/MainMap.vue'
import NotFound from '@/views/error/NotFound.vue'
// import Setting from '@/views/Setting/Setting.vue'

const routes = [
  // { path: '/', name: 'Login Page', component: LoginForm, meta: { requiresAuth:false, title: 'Intellisense Fleet Management System - Login',  } },
  // { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { requiresAuth:false} },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { freeAccess: true, requiresAuth:false }},
  // { path: '/dashboard/details/:id', name: 'Dashboard Details', component: DashboardDetails,props: true, meta: { freeAccess: true, requiresAuth:false }},
  
  { path: '/devices', name: 'Devices List', component: DevicesList, meta: { freeAccess: true, requiresAuth:false }},
  // { path: '/devices/details/:id', name: 'Device Details', component: DeviceDetails, props: true, meta: { freeAccess: true, requiresAuth:false }},
  // { path: '/geolocation', name: 'MainMap', component: MainMap, meta: { freeAccess: true, requiresAuth:false } },
  // { path: '/setting', name: 'Setting', component: Setting, meta: { freeAccess: true, requiresAuth:false } },

  { path: '/:catchALL(.*)', name: 'NotFound', component: NotFound },
  { path: '/', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
})

// router.beforeEach(async (to, from,  next) => {
//   document.title = 'Intellisense Fleet Management System | Connecting Assets'
//   if (to.meta.requiresAuth && !localStorage.getItem('auth.accessToken')){
//     next({ name: 'Dashboard'})
//   } else if (to.meta.requiresAuth && localStorage.getItem('auth.accessToken') || to.meta.freeAccess){
//     next()
//   } else if (!to.meta.requiresAuth && localStorage.getItem('auth.accessToken')){
//     next({name: 'Devices List'})
//   } else next()
//   }) 

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