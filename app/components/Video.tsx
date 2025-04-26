import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video'

interface VideoProps {
  source: VideoSource;
  style?: StyleProp<ViewStyle>;
}

export default function Video({ source, style }: VideoProps) {
  const videoPlayer = useVideoPlayer(source, player => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      player={videoPlayer}
      nativeControls={true}
      allowsFullscreen={false}
      contentFit="cover"
      style={style}
    />
  );
}
