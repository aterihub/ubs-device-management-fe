import apiClient from "./API";



export default {
  getFloors() {
    return apiClient.get('device/getFloor')
  },
  getTrays(params) { 
    return apiClient.get('device/getTray',{ params })
  },
  getDevices(params) {
    return apiClient.get('device/getDevice', { params })
  },
  getAirioFloors() {
    return apiClient.get('airio-device/getFloor')
  },
  getAirioTrays(params) { 
    return apiClient.get('airio-device/getTray',{ params })
  },
  getAirioDevices(params) {
    return apiClient.get('airio-device/getDevice', { params })
  }
}