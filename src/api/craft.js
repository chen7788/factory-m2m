import request from "@/utils/request";
import { setContentType } from '@/utils/auth'

export function getList(page=1,size=20) {
  setContentType(true)
  return request({
    url: '/base/baseRouteDesc/list',
    method: 'post',
    data: {'page':page,'size':size}
  })
}
export function baseProcess(page=1,size=20) {
  setContentType(true)
  return request({
    url: '/base/baseProcess/list',
    method: 'post',
    data: {'page':page,'size':size}
  })
}
