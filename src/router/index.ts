import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {hasAccessToken} from '@/helpers/accessToken'
import {getRouteAccessRedirect, RouteAccessMeta} from '@/helpers/routeAccess'

/* =============== Инициализация роутера ============= */

Vue.use(VueRouter)

const GlobalFeed = () => import('@/views/GlobalFeed.vue')
const YourFeed = () => import('@/views/YourFeed.vue')
const Register = () => import('@/views/Register.vue')
const Login = () => import('@/views/Login.vue')
const TagFeed = () => import('@/views/TagFeed.vue')
const Article = () => import('@/views/Article.vue')
const CreateArticle = () => import('@/views/CreateArticle.vue')
const EditArticle = () => import('@/views/editArticle.vue')
const Settings = () => import('@/views/Settings.vue')
const UserProfile = () => import('@/views/userProfile.vue')

const routes: RouteConfig[] = [
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresAnonymous: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAnonymous: true,
    },
  },
  {
    path: '/',
    name: 'globalfeed',
    component: GlobalFeed,
  },
  {
    path: '/feed',
    name: 'yourFeed',
    component: YourFeed,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/tags/:slug',
    name: 'tag',
    component: TagFeed,
  },
  {
    path: '/articles/new',
    name: 'createArticle',
    component: CreateArticle,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/articles/:slug',
    name: 'article',
    component: Article,
  },
  {
    path: '/articles/:slug/edit',
    name: 'editArticle',
    component: EditArticle,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profiles/:slug',
    name: 'userProfile',
    component: UserProfile,
  },
  {
    path: '/profiles/:slug/favorites',
    name: 'userProfileFavorites',
    component: UserProfile,
  },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  void from

  const redirectRoute = getRouteAccessRedirect(
    to.meta as RouteAccessMeta,
    hasAccessToken()
  )

  if (redirectRoute) {
    next(redirectRoute)
    return
  }

  next()
})

export default router
