import {createApiClient, getAuthorizationHeaderValue} from '@/api/axios'

describe('apiClient', () => {
  it('builds authorization header only for valid token', () => {
    expect(getAuthorizationHeaderValue('token-value')).toBe('Token token-value')
    expect(getAuthorizationHeaderValue('')).toBeUndefined()
    expect(getAuthorizationHeaderValue(null)).toBeUndefined()
  })

  it('creates client with project base url', () => {
    const apiClient = createApiClient()

    expect(apiClient.defaults.baseURL).toBe(
      'https://conduit-realworld-example-app.fly.dev/api'
    )
  })
})
