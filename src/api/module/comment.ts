import ax from '../axios'

// 获取评论
export function getComments (params: any): Promise<Ajax.AjaxResponse> {
  return ax.get('/comments', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}
