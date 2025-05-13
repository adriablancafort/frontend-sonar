import React, { forwardRef, useImperativeHandle, useEffect } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video'

interface VideoProps {
  source: VideoSource;
  style?: StyleProp<ViewStyle>;
  muted?: boolean;
}

export interface VideoHandle {
  setMuted: (muted: boolean) => void;
}

const Video = forwardRef<VideoHandle, VideoProps>(({ source, style, muted }, ref) => {
  const videoPlayer = useVideoPlayer(source, player => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    if (videoPlayer) {
      videoPlayer.muted = muted ?? false;
    }
  }, [muted, videoPlayer]);

  useImperativeHandle(ref, () => ({
    setMuted: (muted: boolean) => {
      videoPlayer.muted = muted;
    }
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