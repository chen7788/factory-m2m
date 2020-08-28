import request from "@/utils/request";
import { setContentType } from '@/utils/auth'

export function getTree() {
  setContentType(true)
  return request({
    url: '/organization/show',
    method: 'post',
  })
}
export function getList(page = 1,size = 20,startTime,endTime) {
  setContentType(true)
  return request({
    url: '/base/baseStaffshift/list',
    method: 'post',
    params: {'page':page,'size':size,'startTime':startTime,'endTime':endTime}
  })
}
