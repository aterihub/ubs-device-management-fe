import axios from "axios";

export default {
  getReport() {
    return axios.get('http://localhost:3000/gateways')
  }
}