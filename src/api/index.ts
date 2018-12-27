import * as user from './module/user'
import * as qn from './module/qn'
import * as tag from './module/tag'
import * as article from './module/article'
import * as comment from './module/comment'
import * as heros from './module/heros'
import * as links from './module/links'

export default {
  ...user,
  ...qn,
  ...tag,
  ...article,
  ...comment,
  ...heros,
  ...links
}
