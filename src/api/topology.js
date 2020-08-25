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
  return request({
    url: '/organddevicenode/bind',
    method: 'post',
    data:{orgIds: orgids, deviceNodeIds: deviceNodeIds}
  })
}
export function unbindNode(orgId,deviceNodeId) {
  setContentType(false)
  // let para = new FormData()
   let data =''
  // para.append(orgId,orgId)
  if (typeof(deviceNodeId) !== "undefined"){
    //para.append('deviceNodeId',deviceNodeId)
    data = {orgId: orgId, deviceNodeId: deviceNodeId}
  }else {
    data = {'orgId': orgId}
  }
  return request({
    url: '/organddevicenode/unbind',
    method: 'post',
    data:data
  })
}
export function addNode(name,remark,sort,parent) {
  setContentType(false)
  return request({
    url: '/propertyty/save',
    method: 'post',
    data:{propertytyName: name, remarks: remark,sortNumber:sort,parentNode:parent}
  })
}
export function upDateNode(name,remark,sort,id,parent) {
  setContentType(false)
  return request({
    url: '/propertyty/update',
    method: 'post',
    data:{propertytyName: name, remarks: remark,sortNumber:sort,id:id,parentNode:parent}
  })
}
export function deleteNode(uuid) {
  setContentType(false)
  return request({
    url: '/propertyty/delete',
    method: 'post',
    data:{uuid:uuid}
  })
}
