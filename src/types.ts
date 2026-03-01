export type View = 'home' | 'timer' | 'configure' | 'stats' | 'settings' | 'library';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  youtubeId?: string;
  style?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  icon: string;
}

export interface Atmosphere {
  id: string;
  name: string;
  icon: string;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  totalSeconds: number;
  initialSeconds: number;
  mode: 'work' | 'rest';
}
