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
  },

  'POSTING_COMMENT' (state: IState): void {
    state.posting = true
  },

  'PUT_COMMENT_SUCCESS' (
    state: IState,
    comment: { _id: string, state: StoreState.State, post_id: string }
  ): void {
    (
      state.list.find((item: StoreState.Comment) => item._id === comment._id) as StoreState.Comment
    ).state = comment.state
  },

  'POST_COMMENT_FINAL' (
    state: IState
  ): void {
    state.posting = false
  },

  'DELETE_COMMENT' (
    state: IState,
    comment: { _id: string, post_id: string }
  ): void {
    (
      state.list.find((item: StoreState.Comment) => item._id === comment._id) as StoreState.Comment
    ).deleting = true
  },

  'DELETE_COMMENT_FINAL' (
    state: IState,
    comment: { _id: string, post_id: string }
  ): void {
    (
      state.list.find((item: StoreState.Comment) => item._id === comment._id) as StoreState.Comment
    ).deleting = false
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
  },

  // 修改评论
  async putComment (
    { commit },
    comment: { _id: string, state: StoreState.State, post_ids: string }
  ): Promise<Ajax.AjaxResponse> {
    commit('POSTING_COMMENT')
    const res: Ajax.AjaxResponse = await service.putComment(comment)
    if (res && res.code === 1) {
      success('修改成功')
      commit('PUT_COMMENT_SUCCESS', comment)
    } else error(res.message)
    commit('POST_COMMENT_FINAL')
    return res
  },

  // 删除评论
  async deleteComment (
    { commit },
    comment: { _id: string, post_id: string }
  ): Promise<Ajax.AjaxResponse> {
    commit('DELETE_COMMENT', comment)
    const res: Ajax.AjaxResponse = await service.deleteComment(comment)
    if (res && res.code === 1) success('删除成功')
    else error(res.message)
    commit('DELETE_COMMENT_FINAL', comment)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
