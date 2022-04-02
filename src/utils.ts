const TWITTER_OEMBED_URL = 'https://publish.twitter.com/oembed';

const buildURL = <T extends object>(url: string, params: T) =>
  (Object.keys(params) as Array<keyof T>).reduce((str, key, idx) => {
    return `${str}${idx ? '&' : '?'}${key}=${(params as T)[key]}`
  }, url)

export type EmbedURLQueryParams = {
  url: string;
  conversation?: 'none';
  cards?: 'hidden';
  align?: 'center'|'right';
  theme?: 'dark';
}

type Embed = {
  author_name: string;
  author_url: string;
  html: string;
  url: string;
  height?: number;
  width?: number;
}

export const fetchTweetEmbed = async (params: EmbedURLQueryParams): Promise<Embed> => {
  const url = buildURL<EmbedURLQueryParams>(TWITTER_OEMBED_URL, params);
  const res = await fetch(url, {  method: 'GET', headers: { Accepts: 'application/json' } });
  return res.json();
}

export const interpolateTweet = (html: string) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        ${html}
    </body>
</html>
`;
