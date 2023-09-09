import apiClient from "./API"



export default {
  getDevices() {
    return apiClient.get('devices')
  },

  getDevice(imei) {
    return apiClient.get(`devices/${imei}`) 
  },

  updateDevice(id,data) {
    return apiClient.patch(`devices/${id}`, data)
  },

  deleteDevice(id) {
    return apiClient.delete(`devices/${id}`)
  },

  createDevices(data) {
    return apiClient.post('devices', data)
  },
  
}