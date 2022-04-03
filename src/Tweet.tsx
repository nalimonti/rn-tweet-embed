import WebView, { WebViewProps } from "react-native-webview";
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  HTMLDimensions,
} from '@formidable-webview/webshell';
import React, { useState, useCallback, useRef } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { useGetTweet } from './useGetTweet';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
);

interface Props extends WebViewProps {
  url: string;
  theme?: 'dark'|'light';
  interceptPress?: () => void;
}

const Tweet = ({ url, theme, interceptPress, ...props }: Props) => {
  const [height, setHeight] = useState(1000);
  const { tweet, error } = useGetTweet({
    align: 'center',
    url,
    ...(theme === 'dark' ? { theme: 'dark' } : {})
  })
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

  if (error) return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('./assets/twitter_logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text
        style={{
          color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'darkgray',
          marginLeft: 5,
      }}
      >
        Unable to render tweet...
      </Text>
    </View>
  )

  if (!tweet) return null;

  return (
    <Animated.View
      style={[ styles.container, { height, transform: [ { scale } ], opacity } ]}
    >
      <Webshell
        javaScriptEnabled={true}
        source={{ html: tweet }}
        onDOMHTMLDimensions={_onDOMHTMLDimensions}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator animating={true} color="green" />
        )}
        { ...props }
        style={[ styles.webView, props.style || {} ]}
      />
      {
        !!interceptPress && (
          <Pressable
            onPressIn={_onPressIn}
            onPressOut={_onPressOut}
            style={styles.pressOverlay}
            onPress={interceptPress}
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
  }
})

export default Tweet;
