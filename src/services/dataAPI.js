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

  getDuplicate(params) {
    return apiClient.get('device/duplicate',{ params })
  },
  getAirioRealtimeData(params) {
    return apiClient.get('airio-device/realtimeData',{ params })
  },

  getAirioDataDensity(params) {
    return apiClient.get('airio-device/density',{ params })
  },  

  getAirioRebootCounter(params) {
    return apiClient.get('airio-device/rebootCounter',{ params })
  },

  getAirioDuplicate(params) {
    return apiClient.get('airio-device/duplicate',{ params })
  },

  getAirioMissingData(params) {
    return apiClient.get('airio-device/missing',{ params })
  },

  getServiceStatus() {
    return apiClient.get('service')
  }


}
