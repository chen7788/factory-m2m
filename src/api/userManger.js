import request from '@/utils/request'

export function getTree() {
  return request({
    url: '/role/show',
    method: 'post',
  })
}

export function getTreeList(data) {
  return request({
    url: '/user/getUserList',
    method: 'get',
    params: {data }
  })
}
