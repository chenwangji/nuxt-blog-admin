/**
 * 留言墙
 */

import { ActionTree, MutationTree, Store } from 'vuex'

import { success, error } from '@/utils/response'
import service from '@/api'

interface IState {
  fetch: boolean
  list: StoreState.Hero[]
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
  list: [],
  total: 0
}

const mutations: MutationTree<IState> = {
  'REQUEST_LIST' (state: IState): void {
    state.fetch = true
  },

  'REQUEST_LIST_SUCCESS' (
    state: IState,
    payload: { list: StoreState.Hero[], total: number }
  ): void {
    state.fetch = false
    state.list = payload.list
    state.total = payload.total
  },

  'REQUEST_LIST_FAIL' (
    state: IState
  ): void {
    state.fetch = false
    state.list = []
    state.total = 0
  },

  'DELETE_HERO' (
    state: IState,
    hero: { _id: string }
  ): void {
    (state.list.find((item: StoreState.Hero) => item._id === hero._id) as StoreState.Hero).deleting = true
  },

  'DELETE_HERO_FINAL' (
    state: IState,
    hero: { _id: string }
  ): void {
    (state.list.find((item: StoreState.Hero) => item._id === hero._id) as StoreState.Hero).deleting = false
  },

  'PATCH_HERO_SUCCESS' (
    state: IState,
    hero: { _id: string, state: StoreState.State }
  ): void {
    (state.list.find((item: StoreState.Hero) => item._id === hero._id) as StoreState.Hero).state = hero.state
  }
}

const actions: ActionTree<IState, any> = {
  // 获取列表
  async getHeros (
    { commit },
    data: IParams
  ): Promise<Ajax.AjaxResponse> {
    commit('REQUEST_LIST')
    const res: Ajax.AjaxResponse = await service.getHeros(data)
    if (res && res.code === 1) {
      const list: StoreState.Hero[] = res.result.list.map((item: StoreState.Hero) => ({ ...item, deleting: false }))
      const total: number = res.result.pagination.total
      commit('REQUEST_LIST_SUCCESS', { list, total })
    } else commit('REQUEST_LIST_FAIL')
    return res
  },

  // 改变留言状态
  async patchHero (
    { commit },
    hero: { _id: string, state: StoreState.State }
  ): Promise<Ajax.AjaxResponse> {
    const res: Ajax.AjaxResponse = await service.patchHero(hero)
    if (res && res.code === 1) {
      success('修改成功')
      commit('PATCH_HERO_SUCCESS', hero)
    } else error(res.message)
    return res
  },

  // 删除留言
  async deleteHero (
    { commit },
    hero: { _id: string }
  ): Promise<Ajax.AjaxResponse> {
    commit('DELETE_HERO', hero)
    const res: Ajax.AjaxResponse = await service.deleteHero(hero)
    if (res && res.code === 1) success('删除成功')
    else error(res.message)
    commit('DELETE_HERO_FINAL', hero)
    return res
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
