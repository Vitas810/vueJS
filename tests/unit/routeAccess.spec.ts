import {getRouteAccessRedirect} from '@/helpers/routeAccess'

describe('routeAccess', () => {
  it('redirects guest from protected route', () => {
    expect(getRouteAccessRedirect({requiresAuth: true}, false)).toEqual({
      name: 'login',
    })
  })

  it('redirects authorized user from anonymous route', () => {
    expect(getRouteAccessRedirect({requiresAnonymous: true}, true)).toEqual({
      name: 'globalfeed',
    })
  })

  it('keeps route when access is allowed', () => {
    expect(getRouteAccessRedirect({}, false)).toBeNull()
    expect(getRouteAccessRedirect({requiresAuth: true}, true)).toBeNull()
  })
})
