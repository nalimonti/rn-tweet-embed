import { useEffect, useState } from 'react';
import { EmbedURLQueryParams, fetchTweetEmbed, interpolateTweet } from './utils';
import { useIsMounted } from './useIsMounted';

export function useGetTweet(params: EmbedURLQueryParams): { tweet?: string; error: boolean } {
  const [tweet, setTweet] = useState<string>();
  const [error, setError] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const { html } = await fetchTweetEmbed(params, abortController);
        if (isMounted.current) setTweet(interpolateTweet(html));
      }
      catch (e) {
        if (isMounted.current) setError(true);
      }
    })()
    return () => { abortController.abort() }
  }, [ params ])

  return { tweet, error };
}
