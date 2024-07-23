import axios from 'axios'

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

// if (process.env.NODE_ENV === 'production') { 
config.baseURL = process.env.VUE_APP_BACKEND_ENDPOINT
// }

const instance = axios.create(config)

export default instance
