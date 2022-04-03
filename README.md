# rn-tweet-embed

WebView based embedded Tweet for React Native

## Installation

```sh
npm install rn-tweet-embed
```
or
```sh
yarn add rn-tweet-embed
```

## Props

You must pass either `tweetUrl` or `tweetId` for this to work.

`tweetUrl` - Tweet URL (eg: `https://twitter.com/reactnative/status/20`)

| Type     | Required |
|----------|----------|
| `string` | No       |

---

`tweetId` - Tweet ID (eg: `20`)

| Type                 | Required |
|----------------------|----------|
| `string` or `number` | No       |

---

`webViewProps` - Props passed to the WebView

| Type                                                                                                                                          | Required |
|-----------------------------------------------------------------------------------------------------------------------------------------------|----------|
| [WebView props](https://github.com/react-native-webview/react-native-webview/blob/5e73b2089fc80c2be7aa6eff291b18c81ad4030d/docs/Reference.md) | No       |

---

`embedParams` - Tweet embed params

| Type                                                                                                                                       | Required |
|--------------------------------------------------------------------------------------------------------------------------------------------|----------|
| [Tweet embed params](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference) | No       |

---

`theme` - Color theme

| Type                  | Required |
|-----------------------|----------|
| `'light'` or `'dark'` | No       |

---

`interceptPress` - Optional callback to intercept widget press

| Type         | Require |
|--------------|---------|
| `() => void` | No      |

## Usage

```js
import { Tweet } from "rn-tweet-embed";

const App = () => {
  const [theme, setTheme] = useState('light');

  const _onPress = () => {
    // handle widget press
  }

  return (
    <Tweet
      interceptPress={_onPress}
      theme={theme}
      tweetUrl="https://twitter.com/reactnative/status/20"
    />
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
