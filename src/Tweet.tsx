import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  HTMLDimensions,
} from '@formidable-webview/webshell';
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Animated, Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { useIsMounted } from './useIsMounted';
import { EmbedParams, tweetHtml } from './utils';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
);

interface OnlyId {
  tweetId: number|string;
  tweetUrl?: never;
}

interface OnlyUrl {
  tweetId?: never;
  tweetUrl: string;
}

type OnlyIdOrUrl = OnlyId | OnlyUrl;

type Props = {
  theme?: 'dark'|'light';
  interceptPress?: () => void;
  webViewProps?: WebViewProps;
  embedParams?: EmbedParams;
} & OnlyIdOrUrl

const Tweet = (props: Props) => {
  const isMounted = useIsMounted();
  const [height, setHeight] = useState(1000);
  const [loading, setLoading] = useState(true);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const _onDOMHTMLDimensions = useCallback(({ content: { height } }: HTMLDimensions) => {
    setHeight(height);
  }, [])

  const _onPressIn = useCallback(() => Animated.parallel([
    Animated.spring(scale, { toValue: 1.03, useNativeDriver: true }),
    Animated.timing(opacity, { toValue: 0.85, useNativeDriver: true, duration: 100 })
  ]).start(), []);

  const _onPressOut = useCallback(() => Animated.parallel([
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 100 })
  ]).start(), []);

  const _onMessage = useCallback(({ nativeEvent }: WebViewMessageEvent) => {
    try {
      const { loaded } = JSON.parse(nativeEvent.data);
      if (loaded && isMounted.current) setLoading(false);
    }
    catch (e) {}
  }, [ isMounted?.current ]);

  const embedParams = useMemo<EmbedParams>(() => props.embedParams || ({
    align: 'center',
    ...(props.theme === 'dark' ? { theme: 'dark' } : {}),
  }), [ props.theme, props.embedParams ]);

  const html = tweetHtml(embedParams, props.tweetId, props.tweetUrl);

  if (!html || !html.length) return (
    <View style={styles.msgContainer}>
      <Image source={require('./assets/twitter_logo.png')} resizeMode="contain" style={styles.logo} />
      <Text style={{ color: props.theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'darkgray', marginLeft: 5 }}>Unable to render Tweet...</Text>
    </View>
  )

  return (
    <Animated.View
      style={[ styles.container, { height, transform: [ { scale } ], opacity } ]}
    >
      <Webshell
        javaScriptEnabled={true}
        onMessage={_onMessage}
        source={{ html }}
        onDOMHTMLDimensions={_onDOMHTMLDimensions}
        { ...(props.webViewProps || {}) }
        style={[ styles.webView, props.webViewProps?.style ?? {} ]}
      />
      {
        loading && (
          <View style={styles.msgContainer}>
            <Image source={require('./assets/twitter_logo.png')} resizeMode="contain" style={styles.logo} />
            <Text style={{ color: props.theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'darkgray', marginLeft: 5 }}>Loading...</Text>
          </View>
        )
      }
      {
        !!props.interceptPress && (
          <Pressable
            onPressIn={_onPressIn}
            onPressOut={_onPressOut}
            style={styles.pressOverlay}
            onPress={props.interceptPress}
          />
        )
      }
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', position: 'relative' },
  webView: { backgroundColor: 'transparent' },
  logo: { height: 60, width: 60 },
  pressOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
  },
  msgContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
})

export default Tweet;
