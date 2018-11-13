/** 文章 store */

import { MutationTree, ActionTree } from 'vuex'
import service from '@/api'
import { success, error } from '@/utils/response'

interface IState {
  fetch: boolean
  posting: boolean
  list: StoreState.Article[]
  total: number
  detail: StoreState.Article
}

interface IParams {
  tag: string
  // eslint-disable-next-line
  page_size: number
  // eslint-disable-next-line
  current_page: number
  keyword?: string
  // eslint-disable-next-line
  state?: StoreState.State
  publish?: StoreState.State
  type?: StoreState.State
}

const state: IState = {
  posting: false,
  fetch: false,
  list: [],
  total: 0,
  detail: {
    title: '',
    keyword: '',
    thumb: '',
    state: '',
    publish: '',
    type: '',
    descript: '',
    tag: []
  }
}

const mutations: MutationTree<IState> = {
  'REQUEST_LIST' (state: IState): void {
    state.fetch = true
  },

  'REQUEST_LIST_SUCCESS' (
    state: IState,
    payload: { list: StoreState.Article[], total: number }
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

  'POST_ARTICLE' (state: IState): void {
    state.posting = true
  },

  'POST_ARTICLE_FINAL' (state: IState): void {
    state.posting = false
  },

  'PATCH_ARTICLE_SUCCESS' (
    state: IState,
    article: { _id: string; state?: StoreState.State; publish?: StoreState.State; [index: string]: any }
  ): void {
    const patchedArticle: StoreState.Article = (state.list.find((item: StoreState.Article) => item._id === article._id)) as StoreState.Article
    for (const key in article) {
      if (article.hasOwnProperty(key)) {
        patchedArticle[key] = article[key]
      }
    }
  },

  'DELETE_ARTICLE' (
    state: IState,
    article: { _id: string }
  ): void {
    (state.list.find((item: StoreState.Article) => item._id === article._id) as StoreState.Article).deleting = true
  },

  'DELETE_ARTICLE_FINAL' (
    state: IState,
    article: { _id: string }
  ): void {
    (state.list.find((item: StoreState.Article) => item._id === article._id) as StoreState.Article).deleting = false
  },

  'REQUEST_DETAIL' (state: IState): void {
    state.fetch = true
  },

  'REQUEST_DETAIL_SUCCESS' (
    state: IState,
    article: StoreState.Article
  ): void {
    state.detail = { ...article }
    state.fetch = false
  },

  'REQUEST_DETAIL_FAIL' (state: IState): void {
    state.fetch = false
  }
}

const actions: ActionTree<IState, any> = {
  // 获取文章列表
  async getArts (
    { commit },
    data: IParams
  ): Promise<Ajax.AjaxResponse> {
    commit('REQUEST_LIST')
    const res = await service.getArts(data)
    if (res && res.code === 1) {
      const list: StoreState.Article[] = res.result.list.map((item: StoreState.Article) => ({ ...item, deleting: false }))
      const total: number = res.result.total
      commit('REQUEST_LIST_SUCCESS', { list, total })
    } else commit('REQUEST_LIST_FAIL')
    return res
  },

  // 获取单个文章
  async getArt (
    { commit },
    params: { _id: string }
  ): Promise<Ajax.AjaxResponse> {
    commit('REQUEST_DETAIL')
    const res: Ajax.AjaxResponse = await service.getArt(params)
    if (res && res.code === 1) commit('REQUEST_DETAIL_SUCCESS', res.result)
    else commit('REQUEST_DETAIL_FAIL')
    return res
  },

  // 添加文章
  async postArt (
    { commit },
    article: StoreState.Article
  ): Promise<Ajax.AjaxResponse> {
    commit('POST_ARTICLE')
    const res: Ajax.AjaxResponse = await service.postArt(article)
    if (res && res.code === 1) success('添加文章成功')
    else error('添加文章失败')
    commit('POST_ARTICLE_FINAL')
    return res
  },

  // 改变状态
  async patchArt (
    { commit },
    article: { _id: string, state?: StoreState.State, publish?: StoreState.State, [index: string]: any }
  ): Promise<Ajax.AjaxResponse> {
    const res: Ajax.AjaxResponse = await service.patchArt(article)
    if (res && res.code === 1) {
      success('修改成功')
      commit('PATCH_ARTICLE_SUCCESS', article)
    } else error(res.message)
    return res
  },

  // 删除文章
  async deleteArt (
    { commit },
    article: { _id: string }
  ): Promise<Ajax.AjaxResponse> {
    commit('DELETE_ARTICLE', article)
    const res: Ajax.AjaxResponse = await service.deleteArt(article)
    if (res && res.code === 1) success('删除成功')
    else error(res.message)
    commit('DELETE_ARTICLE_FINAL', article)
    return res
  },

  // 修改文章
  async putArt (
    { commit },
    article: StoreState.Article
  ): Promise<Ajax.AjaxResponse> {
    commit('POST_ARTICLE')
    const res: Ajax.AjaxResponse = await service.putArt(article)
    if (res && res.code === 1) success('修改文章成功')
    else error('修改文章失败')
    commit('POST_ARTICLE_FINAL')
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
