import apiClient from "./API"


export default {
  getRealtimeData(params) {
    return apiClient.get('device/realtimeData',{ params })
  },

  getDataDensity(params) {
    return apiClient.get('device/density',{ params })
  },  

  getRebootCounter(params) {
    return apiClient.get('device/rebootCounter',{ params })
  },
  getAirioRealtimeData(params) {
    return apiClient.get('airio-device/realtimeData',{ params })
  },

  getAirioDataDensity(params) {
    return apiClient.get('airio-device/density',{ params })
  },  

  getAirioRebootCounter(params) {
    return apiClient.get('airio-device/rebootCounter',{ params })
  }
}
