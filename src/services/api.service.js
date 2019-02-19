import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'


Vue.use(VueAxios, axios)

const apiUrl = process.env['DOCBAKER_API_URL']

function formatUrl(url) {
  return url.startsWith('/') ? url.slice(1) : url
}

export default {
  async delete(service, config) {
    service = formatUrl(service)
    return await Vue.axios.delete(`${apiUrl}/${service}`, config)
  },
  async get(service, config) {
    service = formatUrl(service)
    var response = await Vue.axios.get(`${apiUrl}/${service}`, config)
    return response.data
  },
  async post(service, data) {
    service = formatUrl(service)
    return await Vue.axios.post(`${apiUrl}/${service}`, data)
  },
  async put(service, data) {
    service = formatUrl(service)
    return await Vue.axios.put(`${apiUrl}/${service}`, data)
  }
}
