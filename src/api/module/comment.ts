import ax from '../axios'

// 获取评论
export function getComments (params: any): Promise<Ajax.AjaxResponse> {
  return ax.get('/comments', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}

// 删除评论
export function deleteComment (params: any): Promise<Ajax.AjaxResponse> {
  return ax.delete(`/comment/${params._id}`, params)
    .then(res => res.data)
    .catch(e => console.error(e))
}

// 修改评论
export function putComment (params: any): Promise<Ajax.AjaxResponse> {
  return ax.put(`/comment/${params._id}`, params)
    .then(res => res.data)
    .catch(e => console.error(e))
}
