import request from "@/utils/request";
import { setContentType } from '@/utils/auth'

export function menuSave(data) {
  setContentType(true)
  return request({
    url: 'menu/save',
    method: 'post',
    data:data
  })
}
