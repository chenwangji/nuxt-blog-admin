import { MutationTree, ActionTree } from 'vuex'

import { success, error } from '@/utils/response'
import service from '@/api'

interface IState {
  fetch: boolean
  posting: boolean
  list: StoreState.Comment[]
  total: number
}

interface IParams {
  // eslint-disable-next-line
  page_size: number
  // eslint-disable-next-line
  current_page: number
  keyword?: string
  // eslint-disable-next-line
  state?: StoreState.State
}

const state: IState = {
  fetch: false,
  posting: false,
  list: [],
  total: 0
}

const mutations: MutationTree<IState> = {
  'REQUEST_LIST' (state: IState): void {
    state.fetch = true
  },

  'REQUEST_LIST_SUCCESS' (
    state: IState,
    payload: { list: StoreState.Comment[], total: number }
  ): void {
    state.fetch = false
    state.list = payload.list
    state.total = payload.total
  },

  'REQUEST_LIST_FAIL' (state: IState): void {
    state.fetch = false
    state.list = []
    state.total = 0
  }
}

const actions: ActionTree<IState, any> = {
  // 获取列表
  async getComments (
    { commit },
    data: IParams
  ): Promise<Ajax.AjaxResponse> {
    commit('REQUEST_LIST')
    const res: Ajax.AjaxResponse = await service.getComments(data)
    if (res && res.code === 1) {
      const list: StoreState.Comment[] = res.result.data.map((item: StoreState.Comment) => ({ ...item, deleting: false }))
      const total: number = res.result.pagination.total
      commit('REQUEST_LIST_SUCCESS', { list, total })
    } else commit('REQUEST_LIST_FAIL')
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
