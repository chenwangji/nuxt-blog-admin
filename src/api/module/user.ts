import ax from '../axios'

// 登录
export function login (
  params: any
): Promise<Ajax.AjaxResponse> {
  return ax.post('/login', params)
            .then(res => res.data)
            .catch(e => console.log(e))
}