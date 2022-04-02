import WebView, { WebViewProps } from "react-native-webview";
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  HTMLDimensions,
} from '@formidable-webview/webshell';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { EmbedURLQueryParams, fetchTweetEmbed, interpolateTweet } from './utils';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
);

interface Props extends WebViewProps {
  url: string;
  theme?: 'dark'|'light';
}

const Tweet = ({ url, theme, ...props }: Props) => {
  const [tweetEmbed, setTweetEmbed] = useState<string>();
  const [height, setHeight] = useState(1000);

  useEffect(() => {
    (async () => {
      try {
        const p: EmbedURLQueryParams = {
          align: 'center',
          url,
          ...(theme === 'dark' ? { theme: 'dark' } : {})
        };
        const { html } = await fetchTweetEmbed(p);
        setTweetEmbed(interpolateTweet(html));
      }
      catch (e) {
        console.log('fetch error', e);
      }
    })()
  }, [ url ]);

  const _onDOMHTMLDimensions = useCallback(({ content: { height } }: HTMLDimensions) => {
    setHeight(height);
  }, [])

  if (!tweetEmbed) return null;

  return (
    <View style={{ height }}>
      <Webshell
        javaScriptEnabled={true}
        source={{ html: tweetEmbed }}
        onDOMHTMLDimensions={_onDOMHTMLDimensions}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator animating={true} color="green" />
        )}
        { ...props }
      />
    </View>
  );
}

export default Tweet;
