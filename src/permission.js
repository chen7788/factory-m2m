import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import el from "element-ui/src/locale/lang/el";
import de from "element-ui/src/locale/lang/de";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  let temp = to.path.split('/')
  let tempPath=''
  if (temp[temp.length-1].indexOf('/') != -1){
    tempPath = temp[temp.length-1]
  }else{
    tempPath = '/'+temp[temp.length-1]
  }
  store.dispatch('user/changeMenuLink',tempPath).then(() => {
    console.log(to.path)
  })
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const menu = store.getters.menu && store.getters.menu.length > 0
      if (menu){
        next()
      }else{
        store.dispatch('user/ChangeMenu').then( res => {
          store.dispatch('GenerateRoutes',{res}).then(() => {
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch( (err) => {
          next({ path: '/login' })
          store.dispatch('user/FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')

          }).catch(err => {
            debugger
            console.log(err)
          })
        })
      }
      }
  }else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
