import axiosInstance from './api'
import TokenService from './token.service'

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      
      const token = TokenService.getLocalAccessToken()
      
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token  
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (res) => {

      return res
    },
    async (err) => {

      const originalConfig = err.config
      
      switch (err.response.status) {
      case 498: {

        const rs = await axiosInstance.get('/refresh')

        const accessToken = rs.data.data.token

        TokenService.updateLocalAccessToken(accessToken)
        
        return axiosInstance(originalConfig)
      }
      case 404: {
        store.dispatch('app/showError', {
          message: 'Oops! Algo salió mal, vuelve a intentarlo.',
          error: {
            message: ''
          } 
        })
        break
      }
      case 413: {
        store.dispatch('app/showError', {
          message: 'Oops! Archivo muy pesado.',
          error: {
            message: ''
          } 
        })
        break
      }
      }

      return Promise.reject(err)
    }
  )
}

export default setup