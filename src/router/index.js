import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect:'/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: 'Home', icon: 'dashboard' }
    }],
  }
]
export const asyncRouterMap = [
  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: '系统设置',
    meta: {
      title: '系统设置',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/setting/role/index'),
        name: '角色管理',
        meta: {
          title: '角色管理', icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'topology',
        component: () => import('@/views/setting/topology/index'),
        name: '拓扑管理',
        meta: {
          title: '拓扑管理', icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'menus',
        component: () => import('@/views/setting/menus/index'),
        name: '菜单管理',
        meta: {
          title: '菜单管理', icon: 'dashboard',
          noCache: true
        },
      }
    ]
  },
  {
    path: '/information',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: '基础资料',
    meta: {
      title: '基础资料',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'customer',
        component: () => import('@/views/information/index'),
        name: '客户资料',
        meta: {
          title: '客户资料', icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: '/hhh',
        name: '人力资料',
        redirect: 'noredirect',
        component: () => import('@/views/information/staffshift/index'),
        alwaysShow: true,
        meta: {
          title: '人力资料', icon: 'dashboard',
        },
        children:[
          {
            path: '/staffshift',
            component: () => import('@/views/information/staffshift/index'),
            name: '排班资料',
            meta: {
              title: '排班资料', icon: 'dashboard',
              noCache: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/craft',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: '制造工艺',
    meta: {
      title: '制造工艺',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'material',
        component: () => import('@/views/craft/index'),
        name: '工艺管理',
        meta: {
          title: '工艺管理', icon: 'dashboard',
          noCache: true
        }
      }
    ]
  }
]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
