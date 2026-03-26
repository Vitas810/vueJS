import {buildFeedApiUrl} from '@/helpers/feedApiUrl'

describe('buildFeedApiUrl', () => {
  it('добавляет limit и offset для первой страницы', () => {
    const url = buildFeedApiUrl('/articles', 1)
    expect(url).toContain('limit=10')
    expect(url).toContain('offset=0')
  })

  it('сохраняет query из apiUrl', () => {
    const url = buildFeedApiUrl('/articles?tag=foo', 2)
    expect(url).toContain('tag=foo')
    expect(url).toContain('offset=10')
  })
})
