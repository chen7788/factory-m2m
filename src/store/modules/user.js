import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {getNavMenuList} from '@/api/home'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menu:'',
    menuLink:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_MENULINK: (state, menuLink) => {
    state.menuLink = menuLink
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), passWord: password }).then(response => {
        const { result } = response
        commit('SET_TOKEN', result.TokenId)
        setToken(result.TokenId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  ChangeMenu({commit},data){
    return new Promise((resolve, reject) => {
      getNavMenuList().then(response => {
        const { result } = response
        if (!result) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_MENU','true')
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeMenuLink({commit},data){
    return new Promise(resolve => {
      commit('SET_MENULINK', data)
      resolve()
    })
  },
// 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

