import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video';

// Props passed to the Video component
export interface VideoProps {
  source: VideoSource;
  style?: StyleProp<ViewStyle>;
  muted?: boolean;
}

// Methods exposed via ref
export interface VideoHandle {
  setMuted: (muted: boolean) => void;
  pause: () => void;
  play: () => void;
}

const Video = forwardRef<VideoHandle, VideoProps>(({ source, style, muted }, ref) => {
  const videoPlayer = useVideoPlayer(source, player => {
    player.loop = true;
    player.play();
  });

  // Keep mute status in sync
  useEffect(() => {
    videoPlayer.muted = muted ?? false;
  }, [muted]);

  // Expose play/pause/setMuted methods to parent
  useImperativeHandle(ref, () => ({
    setMuted: (muted: boolean) => {
      videoPlayer.muted = muted;
    },
    pause: () => {
      videoPlayer.pause();
    },
    play: () => {
      videoPlayer.play();
    },
  }));

  return (
    <VideoView
      player={videoPlayer}
      nativeControls={false}
      allowsFullscreen={true}
      contentFit="cover"
      style={style}
    />
  );
});

Video.displayName = 'Video';

export default Video;
