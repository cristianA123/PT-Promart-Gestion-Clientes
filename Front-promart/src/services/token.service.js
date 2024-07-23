class TokenService {
  
  getLocalAccessToken() {
    const user = $cookies.get('token')
    
    return user
  }

  updateLocalAccessToken(token) {
    
    $cookies.set('token', token)
  }
}

export default new TokenService()
