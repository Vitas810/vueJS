import {buildFeedApiUrl} from '@/helpers/feedApiUrl'

describe('buildFeedApiUrl', () => {
  it('добавляет limit и offset для первой страницы', () => {
    const url = buildFeedApiUrl('/articles', 1, 10)

    expect(url).toContain('limit=10')
    expect(url).toContain('offset=0')
  })

  it('сохраняет query из apiUrl', () => {
    const url = buildFeedApiUrl('/articles?tag=foo', 2, 10)

    expect(url).toContain('tag=foo')
    expect(url).toContain('offset=10')
  })

  it('корректно использует выбранный лимит', () => {
    const url = buildFeedApiUrl('/articles', 2, 20)

    expect(url).toContain('limit=20')
    expect(url).toContain('offset=20')
  })
})
