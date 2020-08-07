import request from '@/utils/request'

export function getNavMenuList(params) {
  return request({
    url: '/menu/getNavMenuList',
    method: 'get',
    params
  })
}
