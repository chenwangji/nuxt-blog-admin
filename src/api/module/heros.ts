import ax from '../axios'

// 留言列表
export function getHeros (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.get('/heros', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}

// 删除留言
export function deleteHero (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.delete(`/hero/${params._id}`)
    .then(res => res.data)
    .catch(e => console.error(e))
}

// 修改留言状态
export function patchHero (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.patch('/hero', params)
    .then(res => res.data)
    .catch(e => console.error(e))
}
