import api from './api'

class BackendApi {

  get(endpoint, data) {
    return api.get(endpoint, data)
  }

  post(endpoint, data) {
    return api.post(endpoint, data)
  }

  put(endpoint, data) {
    return api.put(endpoint, data)
  }

  update(endpoint, data) {
    return api.update(endpoint, data)
  }

  delete(endpoint, data) {
    return api.delete(endpoint, data)
  }
  
}

export default new BackendApi()