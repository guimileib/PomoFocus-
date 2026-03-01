import { Task, Atmosphere, Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight Jazz',
    artist: 'Lo-Fi Radio',
    album: 'Night Vibes',
    coverUrl: 'https://picsum.photos/seed/jazz/100/100',
    youtubeId: '5qap5aO4i9A',
    style: 'Jazz'
  },
  {
    id: '2',
    title: 'Lo-Fi Beats to Study To',
    artist: 'Cosmic Chill',
    album: 'Track 04',
    coverUrl: 'https://picsum.photos/seed/chill/100/100',
    youtubeId: 'jfKfPfyJRdk',
    style: 'Lo-Fi'
  },
  {
    id: '3',
    title: 'Rainy Night Coffee Shop',
    artist: 'Ambient Worlds',
    album: 'Atmosphere',
    coverUrl: 'https://picsum.photos/seed/rainy/100/100',
    youtubeId: 'c0_ejQQcrwI',
    style: 'Ambient'
  },
  {
    id: '4',
    title: 'Deep Focus Techno',
    artist: 'Electronic Pulse',
    album: 'Modern Work',
    coverUrl: 'https://picsum.photos/seed/techno/100/100',
    youtubeId: 'f02mOEt11OQ',
    style: 'Electronic'
  },
  {
    id: '5',
    title: 'Study with Me',
    artist: 'Focus Flow',
    album: 'Library Sessions',
    coverUrl: 'https://picsum.photos/seed/study/100/100',
    youtubeId: '4xDzrJKXOOY',
    style: 'Lo-Fi'
  },
  {
    id: '6',
    title: 'Cyberpunk Focus',
    artist: 'Synthwave Dreams',
    album: 'Neon City',
    coverUrl: 'https://picsum.photos/seed/cyber/100/100',
    youtubeId: 'S_MOd40zlYU',
    style: 'Electronic'
  },
  {
    id: '7',
    title: 'Classical Focus',
    artist: 'Mozart & More',
    album: 'Masterpieces',
    coverUrl: 'https://picsum.photos/seed/classical/100/100',
    youtubeId: 'jgpJVI3tD5k',
    style: 'Classical'
  }
];

export const INITIAL_TASKS: Task[] = [];

export const ATMOSPHERES: Atmosphere[] = [
  { id: 'rain', name: 'Rain', icon: 'CloudRain' },
  { id: 'coffee', name: 'Coffee Shop', icon: 'Coffee' },
  { id: 'lofi', name: 'Lo-Fi Beats', icon: 'Headphones' },
  { id: 'white-noise', name: 'White Noise', icon: 'Waves' },
];
