import request from "@/utils/request";
import { setContentType } from '@/utils/auth'
export function leftTreeData() {
  return request({
    url: '/propertyty/show',
    method: 'post',
  })
}
export function deviceTreeData() {
  return request({
    url: '/devicenode/getDeviceNodeTree',
    method: 'get',
  })
}
export function allBinds() {
  return request({
    url: '/organddevicenode/getallbinds',
    method: 'get',
  })
}
export function bindNode(orgids,deviceNodeIds) {
  setContentType(false)
  let para = new FormData()
  para.append('orgIds',orgids)
  para.append('deviceNodeIds',deviceNodeIds)
  return request({
    url: '/organddevicenode/bind',
    method: 'post',
    data:para
  })
}
export function unbindNode(orgId,deviceNodeId) {
  setContentType(false)
  let para = new FormData()
  para.append('orgId',orgId)
  para.append('deviceNodeId',deviceNodeId)
  return request({
    url: '/organddevicenode/unbind',
    method: 'post',
    data:para
  })
}
