import axios from 'axios'


const apiUrl = process.env['DOCBAKER_API_URL']

function formatUrl(url) {
  return url.startsWith('/') ? url.slice(1) : url
}

export default {
  async delete(service, config) {
    service = formatUrl(service)
    return await axios.delete(`${apiUrl}/${service}`, config)
  },
  async get(service, config) {
    service = formatUrl(service)
    var response = await axios.get(`${apiUrl}/${service}`, config)
    return response.data
  },
  async post(service, data) {
    service = formatUrl(service)
    return await axios.post(`${apiUrl}/${service}`, data)
  },
  async put(service, data) {
    service = formatUrl(service)
    return await axios.put(`${apiUrl}/${service}`, data)
  }
}
