import ax from '../axios'

// 获取七牛 token
export function getQiniu (): Promise<Ajax.AjaxResponse> {
  return ax.get('/qiniu')
    .then(res => res.data)
    .catch(e => console.log(e))
}
