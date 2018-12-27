import Vue from 'vue'
import Router, { RouteConfig, Route } from 'vue-router'
import { loginIn } from '@/utils/loginIn'

const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')

const Index = () => import(/* webpackChunkName: "index" */ '@/views/Index.vue')

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home/Index.vue')

const Article = () => import(/* webpackChunkName: "article" */ '@/views/Article/Index.vue')

const Release = () => import(/* webpackChunkName: "release" */ '@/views/Article/Release.vue')

const Comment = () => import(/* webpackChunkName: "comment" */ '@/views/Comment/Index.vue')

const Tags = () => import(/* webpackChunkName: "tag" */ '@/views/Tags/Index.vue')

const Error = () => import(/* webpackChunkName: "error" */ '@/views/404.vue')

const Set = () => import(/* webpackChunkName: "set" */ '@/views/Set/Index.vue')

const Heros = () => import(/* webpackChunkName: "heros" */ '@/views/Heros/Index.vue')

Vue.use(Router)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: '我的面板',
    component: Index,
    redirect: '/home',
    meta: { leaf: true, icon: 'icon-home' },
    children: [
      { path: '/home', component: Home, name: '我的面板', meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/',
    name: '全局设置',
    component: Index,
    meta: { leaf: true, icon: 'icon-set' },
    children: [
      { path: '/set', component: Set, name: '全局设置', meta: { page: 'set', requiresAuth: true } }
    ]
  },
  {
    path: '/',
    name: '文章管理',
    component: Index,
    meta: { leaf: false, icon: 'icon-article' },
    children: [
      { path: '/article/index', component: Article, name: '文章列表', meta: { icon: 'icon-list', requiresAuth: true } },
      { path: '/article/release', component: Release, name: '发布文章', meta: { icon: 'icon-write', requiresAuth: true } }
    ]
  },
  {
    path: '/',
    name: '文章标签',
    component: Index,
    meta: { leaf: true, icon: 'icon-tag' },
    children: [
      { path: '/tag', component: Tags, name: '文章标签', meta: { requiresAuth: true, icon: 'icon-tag' } }
    ]
  },
  {
    path: '/',
    name: '评论',
    component: Index,
    meta: { leaf: true, icon: 'icon-comments' },
    children: [
      { path: '/comment', component: Comment, name: '评论', meta: { icon: 'icon-comments', requiresAuth: true } }
    ]
  },
  {
    path: '/',
    name: '留言墙',
    component: Index,
    meta: { leaf: true, icon: 'icon-hero' },
    children: [
      { path: '/heros', component: Heros, name: '留言墙', meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '*',
    name: '404',
    component: Error,
    meta: { requiresAuth: false }
  }
]

const router: Router = new Router({
  mode: 'hash',
  routes
})

router.beforeEach((to: Route, from: Route, next: any): void => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loginIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
