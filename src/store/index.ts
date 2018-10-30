import Vue from 'vue'
import Vuex, { ActionTree, MutationTree } from 'vuex'

import { success, error } from '@/utils/response'
import service from '@/api'


Vue.use(Vuex)

interface IState {
  login: boolean
  // user: StoreState.user
  // list: StoreState.Article[]
  // total: number
  // detail: StoreState.Article
}

const state: IState = {
  login: false
}

const mutations: MutationTree<IState> = {
  'USER_LOGINING' (state: IState): void {
    state.login = true
  },

  'USER_LOGINING_FINAL' (state: IState): void {
    state.login = false
  }
}

const actions: ActionTree<IState, any> = {
  // 登录
  async login (
    { commit },
    user: StoreState.Login
  ): Promise<Ajax.AjaxResponse> {
    commit('USER_LOGINING')
    const res: Ajax.AjaxResponse = await service.login({ ...user })
    if (res && res.code === 1) {
      window.localStorage.setItem('TOKEN', JSON.stringify(res.result))
      success('登录成功')
    } else {
      error(res.message)
    }
    commit('USER_LOGINING_FINAL')
    return res
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
