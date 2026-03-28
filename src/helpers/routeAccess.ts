import {RawLocation} from 'vue-router'

/* =============== Доступ к маршрутам ============= */

export interface RouteAccessMeta {
  requiresAnonymous?: boolean
  requiresAuth?: boolean
}

// Редирект по правилам доступа
export function getRouteAccessRedirect(
  routeMeta: RouteAccessMeta,
  isAuthorized: boolean
): RawLocation | null {
  if (routeMeta.requiresAuth && !isAuthorized) {
    return {name: 'login'}
  }

  if (routeMeta.requiresAnonymous && isAuthorized) {
    return {name: 'globalfeed'}
  }

  return null
}
