import * as React from 'react';
import { Tweet } from 'rn-tweet-embed';
import { SafeAreaView } from 'react-native';

export default function App() {
  const _openLink = () => {

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <Tweet
        // tweetUrl="https://twitter.com/reactnative/status/1509213219507748868?s=20&t=3U0VMNR-P2d7HXoLbwm-dg"
        tweetId="20"
        theme="dark"
        interceptPress={_openLink}
      />
    </SafeAreaView>
  );
}
