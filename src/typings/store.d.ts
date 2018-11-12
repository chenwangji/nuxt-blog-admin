declare namespace StoreState {

  export type State = 0 | 1 | 2 | 3 | string

  // 公共
  interface Common {
    /** 唯一标识 */
    readonly _id?: string

    /** 发布日期 */
    readonly create_at?: Date

    /** 修改日期 */
    readonly update_at?: Date

    /** 删除中 */
    deleting?: boolean
  }

  // 登录
  export interface Login {
    /** 用户名 */
    username: string

    /** 密码 */
    password: string
  }

  // 用户数据
  export interface User {
    /** 唯一标识 */
    readonly _id: string

    /** 姓名 */
    name: string

    /** 用户名 */
    username: string

    /** 密码 */
    password?: string

    /** 原密码 */
    oldPassword: string

    /** 新密码 */
    newPassword: string

    /** 用户签名 */
    slogan: string

    /** 头像 */
    gravatar: string
  }

  // 网站信息
  export interface Option {
    /** 唯一标识 */
    readonly _id: string

    /** 网站标题 */
    title: string

    /** 副标题 */
    sub_title: string

    /** 关键字 */
    keyword: string

    /** 描述 */
    descript: string

    /** 地址 */
    url: string

    /** email */
    email: string

    /** 备案号 */
    icp: string
  }

  export interface Tag extends Common {
    /** 名称 */
    name: string

    /** 描述 */
    descript: string

    /** 排序 */
    sort?: number

    /** 文章数量 */
    count?: number
  }

  export interface Article extends Common {
    /** 标题 */
    title: string

    /** 关键字 */
    keyword: string

    /** 描述 */
    descript: string

    /** 内容 */
    content?: string,

    /** 状态 */
    state: State

    /** 公开状态 */
    publish: State

    /** 类别 */
    type: State

    /** 缩略图 */
    thumb: string

    /** 其他 */
    [propName: string]: any
  }
}
