import ax from '../axios'

// 获取文章列表
export function getArts (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.get('/article', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}

// 添加文章
export function postArt (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.post('/article', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}

// 修改文章状态
export function patchArt (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.patch(`/article/${params._id}`, params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
