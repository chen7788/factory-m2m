import request from "@/utils/request";

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
  return request({
    url: '/organddevicenode/bind',
    method: 'post',
    data:{'orgids':orgids,'deviceNodeIds':deviceNodeIds}
  })
}
