import { useRef, useCallback } from 'react';

// A tiny, silent video file encoded as a data URL.
// This is the fallback mechanism for browsers that don't support the Wake Lock API.
const silentVideo =
  'data:video/mp4;base64,AAAAHGZ0eXBNU05WAAACAE1TTlYAAAOUbW9vdgAAAGxtdmhkAAAAAM9ipeEzyKnZAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAAdLgpj/S4KY/AAAAAQAAAAAAAABfAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAABZWR0cwAAABxlbHN0AAAAAAAAAAEAAH0gAABfAQAAAAGvbWRpYQAAACBtZGhkAAAAAM9ipeEzyKnZQFUAAVFGt1hZAAAAAF5oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAIptpW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAADsc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAY3R0cwAAAAAAAAAAAgAAAAUAAGEAAAAKAAAAHAAAAAIAAAAF////AAAF/////wAAADRzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAABMc3RzegAAAAAAAAAAAAAABgAAAGwAAAAcAAAACAAAABAAAAAcAAAACAAAAFAAAAAcAAAAQAAAAFHN0Y28AAAAAAAAAAQAAADAAAAAAYnVkdGEAAABgbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGxpAAAAAAAAAAAAAAAAC2lsc3QAAAAeqW5mbwAAAAthcnRpc3QAAAAQZGF0YQAAAAEAAAAAVGhlIFBhcms=';

function useWakeLock() {
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const createVideo = useCallback(() => {
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.src = silentVideo;
    video.style.display = 'none';
    document.body.appendChild(video);
    return video;
  }, []);

  const playVideo = useCallback(() => {
    if (!videoRef.current) {
      videoRef.current = createVideo();
    }

    // Fire-and-forget the play command. Do not await it.
    // This ensures the call is synchronous with the user's tap
    // Otherwise won't work with iOS
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay was prevented.
        console.error('Fallback Wake Lock (video) failed to play:', err);
      });
    }
  }, [createVideo]);

  const request = useCallback(() => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    if (navigator.wakeLock) {
      navigator.wakeLock
        .request('screen')
        .then((lock) => {
          wakeLock.current = lock;
        })
        .catch((err) => {
          console.error('Native Wake Lock request failed:', err);
        });
      return;
    }

    // Fallback for iOS and other browsers: silent video
    try {
      playVideo();
    } catch (err) {
      console.error('Fallback Wake Lock (video) failed to play:', err);
    }
  }, [playVideo]);

  const release = useCallback(() => {
    // Release the native lock if it exists
    if (wakeLock.current) {
      wakeLock.current.release().then(() => {
        wakeLock.current = null;
      });
    }

    // Pause the video if the fallback is active
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return { request, release };
}

export default useWakeLock;
