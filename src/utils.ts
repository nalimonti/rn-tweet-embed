export type EmbedParams = {
  conversation?: 'none';
  cards?: 'hidden';
  align?: 'center'|'right';
  theme?: 'dark';
}

export const extractIdFromUrl = (url: string) => {
  const match = url.match(/status\/([0-9]*)/);
  if (!match || !match.length) return;
  return match[0].replace('status/', '');
}

const WIDGET_JS = `
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
  return t;
}(document, "script", "twitter-wjs"));
`;

export const tweetHtml = (params: EmbedParams, id?: number|string, url?: string) => {
  let _id = id;
  if (url && url.length) _id = extractIdFromUrl(url);
  if (!_id) return;
  return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>
          ${WIDGET_JS}
          twttr.ready(function (twttr) {
            twttr.widgets.createTweet("${_id}", document.getElementById('container'), ${JSON.stringify(params)})
              .then(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ loaded: true }));
              });

          })
        </script>
    </head>
    <body>
        <div id='container'></div>
    </body>
</html>
`
}
