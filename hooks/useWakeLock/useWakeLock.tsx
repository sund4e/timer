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

  const playVideo = useCallback(async () => {
    if (!videoRef.current) {
      videoRef.current = createVideo();
    }
    await videoRef.current.play();
  }, [createVideo]);

  const request = useCallback(async () => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    if (navigator.wakeLock) {
      try {
        if (!wakeLock.current) {
          wakeLock.current = await navigator.wakeLock.request('screen');
          console.log('Native Wake Lock acquired');
        }
      } catch (err) {
        console.error('Native Wake Lock request failed:', err);
      }
      return;
    }

    try {
      await playVideo();
      console.log('Fallback Wake Lock enabled (video playing)');
    } catch (err) {
      console.error('Fallback Wake Lock (video) failed to play:', err);
    }
  }, [playVideo]);

  const release = useCallback(async () => {
    if (wakeLock.current) {
      await wakeLock.current.release();
      wakeLock.current = null;
      console.log('Native Wake Lock released');
    }
    if (videoRef.current) {
      videoRef.current.pause();
      console.log('Fallback Wake Lock released (video paused)');
    }
  }, []);

  return { request, release };
}

export default useWakeLock;
