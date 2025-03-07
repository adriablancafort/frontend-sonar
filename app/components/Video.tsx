import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

const VideoPlayer = () => {
  const videoSource = { uri: 'https://irjubpjnvgdhlyzigdpn.supabase.co/storage/v1/object/public/MySonar%20Videos/charlotte_de_white.mp4' };
  const videoPlayer = useVideoPlayer(videoSource);

  useEffect(() => {
    if (videoPlayer) {
      videoPlayer.play();
    }
  }, [videoPlayer]);

  return (
    <VideoView
      player={videoPlayer}
      nativeControls={false}
      allowsFullscreen={false}
      contentFit="cover"
      style={styles.video}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default VideoPlayer;