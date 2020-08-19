import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const TypeKey = 'content_type'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getContentType() {
  return Cookies.get(TypeKey)
}

export function setContentType(isJson) {
  let str = 'application/json'
  if (!isJson){
    str = 'application/x-www-form-urlencoded'
  }
  return Cookies.set(TypeKey, str)
}

