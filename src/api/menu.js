import request from "@/utils/request";
import { setContentType } from '@/utils/auth'

export function menuSave(id,form,data) {
  setContentType(true)
  if (JSON.stringify(data) === '{}') {
    data = null
  }
  let state = ''
  if ('显示' === form.selectStatus){
    state = 'true'
  }else {
    state = 'false'
  }
  return request({
    url: 'menu/save',
    method: 'post',
    data:{'menuIcon':form.icon,'menuLink':form.address,'menuName':form.name,'modulesMaps':data,'parentId':id,'showIndex':form.sort,'state':state}
  })
}
export function updateSave(id,form,data) {
  setContentType(true)
  if (JSON.stringify(data) === '{}') {
    data = null
  }
  let state = ''
  if ('显示' === form.selectStatus){
    state = 'true'
  }else {
    state = 'false'
  }
  return request({
    url: 'menu/update',
    method: 'post',
    data:{'menuIcon':form.icon,'menuLink':form.address,'menuName':form.name,'modulesMaps':data,'parentId':id,'showIndex':form.sort,'state':state}
  })
}
