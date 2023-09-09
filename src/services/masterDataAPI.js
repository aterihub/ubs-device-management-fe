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
  }
}