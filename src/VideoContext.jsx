import { createContext, useContext } from 'react';

export const VideoContext = createContext(false);
export const useVideoLooping = () => useContext(VideoContext);
