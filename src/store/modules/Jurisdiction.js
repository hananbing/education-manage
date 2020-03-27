import environment from '../../environmental'
export default {
  state: {
    auth: JSON.parse(sessionStorage.getItem('auth')) || [],
    userInfo: {}, //保存当前登录用户的信息
    userLevel: '', //用户等级
    IP: environment.env().url, //请求IP
    winHeight: '', // 窗口高度
    isRouterAlive: true //HOME路由是否刷新
  },
  mutations: {
    setAuth(state, list) {
      sessionStorage.setItem('auth', JSON.stringify(list))
      state.auth = list
    },
    setwinHeight(state, obj) {
      state.winHeight = obj.val
    },
    // 刷新HOME路由
    refershHomeRouter(state, obj) {
      state.isRouterAlive = obj.val
    }
  },
  getters: {
    checkAuth(state) {
      return permissionId => {
        if (permissionId === '') {
          return true
        }
        let flag = false
        flag = treeSelectAuth(state.auth, permissionId, flag)
        return flag
      }
    },
    //获取符合权限的按钮组
    checkAuthAllBtn(state) {
      return permissionIds => {
        return permissionIds.filter(item => {
          let flag = false
          if (!item) {
            return true
          }
          return treeSelectAuth(state.auth, item, flag)
        })
      }
    }
  },
  actions: {
    setAuth(store, list) {
      store.commit('setAuth', list)
    }
  }
}
let treeSelectAuth = function(array, permissionId, flag = false) {
  array.map(item => {
    if (
      item.permission.find(e => {
        return e.permissionId === permissionId
      })
    ) {
      flag = true
    }
    if (item.children) {
      flag = treeSelectAuth(item.children, permissionId, flag)
    }
  })
  return flag
}
