import React from 'react';

import myBackgroundVideo from './assets/crossover_episode.mp4';
const VideoBackground = () => {
  return (
    <div className="video-background">
      <video autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'fit' }}>
        {/* Replace "your-video-file.mp4" with the path to your video file */}
        <source src={myBackgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;