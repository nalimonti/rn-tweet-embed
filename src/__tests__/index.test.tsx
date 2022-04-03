import {extractIdFromUrl, tweetHtml} from '../utils';

describe('utils', () => {
  test('extractIdFromUrl', () => {
    expect(
      extractIdFromUrl('https://twitter.com/reactnative/status/20?s=234234')
    ).toEqual('20')
  })

  test('tweetHtml', () => {
    expect(
      tweetHtml({}, undefined, undefined)
    ).toBeUndefined()

    expect(
      tweetHtml({}, 20, undefined)
    ).toMatch(/twttr.widgets.createTweet\("20"/)

    expect(
      tweetHtml({}, undefined, 'https://twitter.com/reactnative/status/20?s=234234')
    ).toMatch(/twttr.widgets.createTweet\("20"/)
  })
})
