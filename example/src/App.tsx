import * as React from 'react';
import { Tweet } from 'rn-tweet-embed';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <Tweet
        url="https://twitter.com/LeveragedLayman/status/1510270424386523138?s=20&t=vqaasl1V2J9_p4BJF3iXig"
        theme="dark"
      />
    </SafeAreaView>
  );
}
