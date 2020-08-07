import { asyncRouterMap, constantRouterMap } from '@/router'
import el from "element-ui/src/locale/lang/el";


/**
 * 通过meta.perms判断是否与当前用户权限匹配
 * @param perms
 * @param route
 */
function hasPermission(menus, route) {
  if (route.name){
    let currMenu = getMenu(route.name, menus);
    if (currMenu != null){
      //设置菜单的标题、图标和可见性
      if (currMenu.menuName != null && currMenu.menuName !== '') {
        route.meta.title = currMenu.menuName;
      }
      // if (currMenu.menuIcon != null && currMenu.menuIcon !== '') {
      //   route.meta.icon = currMenu.menuIcon;
      // }
      if(currMenu.hidden!=null){
        route.hidden = currMenu.hidden !== 0;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    }else{
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        return true;
      } else {
        return false;
      }
    }
  }else{
    return true
  }
}
//根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name===menu.menuName) {
      return menu;
    }
  }
  return null;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if(router.children && router.children.length > 0){
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}
//降序比较函数
function compare(p){
  return function(m,n){
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param perms
 */
function filterAsyncRouter(routes, perms) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRouter(tmp.children, perms)
      if (tmp.children && tmp.children.length > 0) {
        res.push(tmp)
      }
    } else {
      debugger
      if (hasPermission(perms, tmp)) {
        res.push(tmp)
      }
    }
  })
  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let accessedRouters
        if (!data||data.length == 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = asyncRouterMap.filter(v => {
            //admin帐号直接返回所有菜单
            // if(username==='admin') return true;
            if (hasPermission(data.res, v)) {
              let menuTemp = getMenu(v.name,data.res)
              if (v.children && v.children.length > 0) {
                v.children = v.children.filter(child => {
                  if (hasPermission(menuTemp.children, child)) {
                    return child
                  }
                  return false;
                });
                return v
              } else {
                return v
              }
            }
            return false;
          })
        }
        //对菜单进行排序
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
