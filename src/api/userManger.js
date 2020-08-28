import request from '@/utils/request'
import de from "element-ui/src/locale/lang/de";
import {setContentType} from "@/utils/auth";

export function getTree() {
  return request({
    url: '/role/show',
    method: 'post',
  })
}

export function getRoleUserList(roleId=0,size=20,page=1) {
  return request({
    url: '/role/getRoleUserList',
    method: 'get',
    params: {"roleId":roleId,size:size,page:page }
  })
}
export function deleteRoleList(ids) {
  return request({
    url: '/role/deleteList',
    method: 'post',
    params: {"ids":ids }
  })
}
export function updateRole(id,parentId,data) {
  return request({
    url: 'role/update',
    method: 'post',
    params: {'id':id,'parentId':parentId,'name':data.name,'roleLeaf':data.type,'sort':data.code,'description':data.desc},
  })
}

export function addRole(id,parentId,data) {
  return request({
    url: 'role/add',
    method: 'post',
    params: {'id':id,'parentId':parentId,'name':data.name,'roleLeaf':data.type,'sort':data.code,'description':data.desc}
  })
}
export function getUserList(search='',size=20,page=1) {
  return request({
    url: '/user/getUserList',
    method: 'get',
    params: {"search":search,size:size,page:page }
  })
}
export function saveRoleUser(roleId,userIds) {
  return request({
    url: '/role/saveRoleUser',
    method: 'post',
    data:{'roleId':roleId,'userIds':userIds}
  })
}
export function deleteRoleUser(roleId,userIds) {
  return request({
    url: '/role/deleteRoleUser',
    method: 'post',
    data:{'roleId':roleId,'userIds':userIds}
  })
}
export function getMenuList(page,size) {
  return request({
    url: '/menu/getMenuList',
    method: 'get',
    params:{page:page,size:size}
  })
}
export function getMenuPermission(roleId,type) {
  return request({
    url: '/rolePermissions/getMenuPermissions',
    method: 'get',
    params:{'roleId':roleId,'menuType':type}
  })
}

export function setMenuPermissions(data) {
  setContentType(true)
  return request({
    url: '/rolePermissions/setMenuPermissions/ff8080817292d6a70173e1493325002f',
    method: 'post',
    data:data
  })
}
