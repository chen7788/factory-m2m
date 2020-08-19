import request from "@/utils/request";
import { setContentType } from '@/utils/auth'

export function login(data) {
  setContentType(true)
  return request({
    url: '/user/login',
    method: 'post',
    params:{account: data["account"], passWord: data["passWord"]}
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function getNavMenuList() {
  return request({
    url: '/menu/getNavMenuList',
    method: 'get'
  })
}

