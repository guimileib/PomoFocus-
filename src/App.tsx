import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Timer as TimerIcon, 
  Library, 
  Settings, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  BookOpen,
  Brush,
  Check,
  Bell,
  Plus,
  CloudRain,
  Coffee,
  Headphones,
  Waves,
  X,
  StopCircle,
  Volume2,
  VolumeX,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, Task, Atmosphere, TimerState, Track } from './types';
import { INITIAL_TASKS, ATMOSPHERES, TRACKS } from './constants';

// --- Helpers ---

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// --- Components ---

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Brush': return <Brush className={className} />;
    case 'Check': return <Check className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Waves': return <Waves className={className} />;
    default: return <Plus className={className} />;
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [musicTracks, setMusicTracks] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = musicTracks[currentTrackIndex];

  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isActive: false,
    totalSeconds: 25 * 60,
    initialSeconds: 25 * 60,
    mode: 'work'
  });
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string>('rain');
  const [volume, setVolume] = useState(50);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [focusTime, setFocusTime] = useState(0); // in seconds
  const [completedSessions, setCompletedSessions] = useState(0);
  const [language, setLanguage] = useState<'en' | 'pt'>('en');
  const [userPhoto, setUserPhoto] = useState('https://picsum.photos/seed/user/100/100');
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState(() => getCookie('user_name') || 'Alex');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null);
  const atmosphereAudioRef = useRef<HTMLAudioElement>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, text: string, time: string}[]>([
    { id: '1', text: 'Welcome to PomoFocus!', time: 'Just now' },
    { id: '2', text: 'Don\'t forget to stay hydrated.', time: '5m ago' }
  ]);
  const notificationAudioRef = useRef<HTMLAudioElement>(null);

  const activeTask = tasks.find(t => t.id === selectedTaskId);
  const styles = ['All', ...Array.from(new Set(musicTracks.map(t => t.style).filter(Boolean)))];
  const filteredTracks = selectedStyle === 'All' ? musicTracks : musicTracks.filter(t => t.style === selectedStyle);

  const handleNameChange = (name: string) => {
    setUserName(name);
    setCookie('user_name', name, 365);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    if (tempPhoto) {
      setUserPhoto(tempPhoto);
      setTempPhoto(null);
    }
  };

  const cancelPhoto = () => {
    setTempPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const t = {
    en: {
      goodMorning: "Good Morning,",
      tasksPending: "Tasks Pending",
      focusTime: "Focus Time",
      sessions: "Sessions",
      todaysTasks: "Today's Tasks",
      viewAll: "View All",
      startFocus: "Start Focus",
      repeat: "Repeat",
      newTrack: "New Track",
      settings: "Settings",
      language: "Language",
      accountPhoto: "Account Photo",
      save: "Save Changes",
      home: "Home",
      focusMode: "Focus Mode",
      library: "Music Library",
      changePhoto: "Upload Photo",
      confirmPhoto: "Confirm Photo",
      cancel: "Cancel",
      selectTask: "Select a task to start",
      noTaskSelected: "No task selected",
      configureSession: "Configure Session",
      playlist: "Playlist",
      youtubeLibraryDesc: "Listen to your favorite YouTube tracks while you focus.",
      styles: "Styles",
      atmosphere: "Atmosphere",
      playingNow: "Playing Now",
      addMusic: "Add Music",
      musicTitle: "Music Title",
      artistName: "Artist Name",
      youtubeId: "YouTube Video ID",
      style: "Style (e.g. Lo-Fi, Jazz)",
      createMusic: "Add to Library",
      focusSession: "Focus Session",
      restSession: "Rest Session",
      takingBreak: "Taking a break...",
      minutesRemaining: "Minutes Remaining",
      restTimeRemaining: "Rest Time Remaining",
      notifications: "Notifications",
      clearAll: "Clear all",
      noNotifications: "No new notifications"
    },
    pt: {
      goodMorning: "Bom Dia,",
      tasksPending: "Tarefas Pendentes",
      focusTime: "Tempo de Foco",
      sessions: "Sessões",
      todaysTasks: "Tarefas de Hoje",
      viewAll: "Ver Tudo",
      startFocus: "Iniciar Foco",
      repeat: "Repetir",
      newTrack: "Nova Tarefa",
      settings: "Configurações",
      language: "Idioma",
      accountPhoto: "Foto da Conta",
      save: "Salvar Alterações",
      home: "Início",
      focusMode: "Modo Foco",
      library: "Biblioteca",
      changePhoto: "Carregar Foto",
      confirmPhoto: "Confirmar Foto",
      cancel: "Cancelar",
      selectTask: "Selecione uma tarefa para começar",
      noTaskSelected: "Nenhuma tarefa selecionada",
      configureSession: "Configurar Sessão",
      playlist: "Playlist",
      youtubeLibraryDesc: "Ouça suas faixas favoritas do YouTube enquanto se concentra.",
      styles: "Estilos",
      atmosphere: "Atmosfera",
      playingNow: "Tocando Agora",
      addMusic: "Adicionar Música",
      musicTitle: "Título da Música",
      artistName: "Nome do Artista",
      youtubeId: "ID do Vídeo YouTube",
      style: "Estilo (ex: Lo-Fi, Jazz)",
      createMusic: "Adicionar à Biblioteca",
      focusSession: "Sessão de Foco",
      restSession: "Sessão de Descanso",
      takingBreak: "Fazendo uma pausa...",
      minutesRemaining: "Minutos Restantes",
      restTimeRemaining: "Tempo de Descanso Restante",
      notifications: "Notificações",
      clearAll: "Limpar tudo",
      noNotifications: "Sem novas notificações"
    }
  }[language];

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  const formatFocusTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${seconds % 60}s`;
  };

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      status: 'pending',
      icon: 'BookOpen'
    };
    setTasks(prev => [newTask, ...prev]);
    setIsAddTaskModalOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addMusicTrack = (title: string, artist: string, youtubeId: string, style: string) => {
    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      artist,
      album: 'Custom Upload',
      coverUrl: `https://picsum.photos/seed/${title}/100/100`,
      youtubeId,
      style
    };
    setMusicTracks(prev => [...prev, newTrack]);
    setIsAddMusicModalOpen(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isActive && timer.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTotal = prev.totalSeconds - 1;
          return {
            ...prev,
            totalSeconds: newTotal,
            minutes: Math.floor(newTotal / 60),
            seconds: newTotal % 60
          };
        });
        setFocusTime(prev => prev + 1);
      }, 1000);
    } else if (timer.totalSeconds === 0 && timer.isActive) {
      // Play notification sound
      if (notificationAudioRef.current) {
        notificationAudioRef.current.play().catch(() => {});
      }
      
      const nextMode = timer.mode === 'work' ? 'rest' : 'work';
      const nextSeconds = nextMode === 'work' ? 25 * 60 : 5 * 60;
      
      setTimer(prev => ({ 
        ...prev, 
        isActive: false,
        mode: nextMode,
        totalSeconds: nextSeconds,
        initialSeconds: nextSeconds,
        minutes: Math.floor(nextSeconds / 60),
        seconds: 0
      }));
      
      if (timer.mode === 'work') {
        setCompletedSessions(prev => prev + 1);
      }
      
      // Add notification
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const message = timer.mode === 'work' 
        ? 'Focus session completed! Time for a 5-minute break.' 
        : 'Break is over! Ready to focus again?';
        
      setNotifications(prev => [
        { id: Date.now().toString(), text: message, time: timeStr },
        ...prev
      ]);
    }
    return () => clearInterval(interval);
  }, [timer.isActive, timer.totalSeconds]);

  const toggleTimer = () => {
    if (!timer.isActive && !selectedTaskId && currentView !== 'timer') {
      alert(t.selectTask);
      return;
    }
    setTimer((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (youtubePlayerRef.current && youtubePlayerRef.current.contentWindow) {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      youtubePlayerRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    }
  }, [isPlaying]);

  useEffect(() => {
    if (youtubePlayerRef.current && youtubePlayerRef.current.contentWindow) {
      youtubePlayerRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [volume] }),
        '*'
      );
    }
    if (atmosphereAudioRef.current) {
      atmosphereAudioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (atmosphereAudioRef.current) {
      if (timer.isActive) {
        atmosphereAudioRef.current.play().catch(() => {});
      } else {
        atmosphereAudioRef.current.pause();
      }
    }
  }, [timer.isActive, selectedAtmosphere]);

  const getAtmosphereAudioUrl = (id: string) => {
    switch (id) {
      case 'rain': return 'https://www.soundjay.com/nature/rain-01.mp3';
      case 'coffee': return 'https://www.soundjay.com/ambient/coffee-shop-1.mp3';
      case 'lofi': return null;
      case 'white-noise': return 'https://www.soundjay.com/ambient/white-noise-01.mp3';
      default: return null;
    }
  };
  const resetTimer = () => setTimer(prev => ({ 
    ...prev, 
    isActive: false, 
    mode: 'work',
    totalSeconds: prev.initialSeconds,
    minutes: Math.floor(prev.initialSeconds / 60),
    seconds: prev.initialSeconds % 60
  }));

  const startSession = (duration: number) => {
    if (!selectedTaskId) {
      alert(t.selectTask);
      return;
    }
    setTimer({
      minutes: duration,
      seconds: 0,
      isActive: true,
      totalSeconds: duration * 60,
      initialSeconds: duration * 60
    });
    setCurrentView('timer');
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % musicTracks.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + musicTracks.length) % musicTracks.length);

  return (
    <div className="flex h-screen w-full bg-bg-light overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 h-full flex flex-col justify-between bg-white border-r border-black/5 p-6 hidden md:flex z-20">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <TimerIcon className="size-6 text-text-main" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold leading-none">PomoFocus</h1>
              <p className="text-text-muted text-xs font-normal">Productivity & Music</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'home', label: t.home, icon: Home },
              { id: 'timer', label: t.focusMode, icon: TimerIcon },
              { id: 'library', label: t.library, icon: Library },
              { id: 'settings', label: t.settings, icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ${
                  currentView === item.id 
                    ? 'bg-primary/20 text-text-main font-semibold' 
                    : 'text-text-muted hover:bg-black/5'
                }`}
              >
                <item.icon className={`size-5 ${currentView === item.id ? 'text-text-main' : ''}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mini Player Widget (Sidebar) */}
        {['library', 'settings', 'stats', 'configure'].includes(currentView) && (
          <div className="bg-bg-light rounded-2xl p-4 border border-black/5">
            <div className="flex gap-3 mb-3">
              <img 
                src={currentTrack.coverUrl || undefined} 
                alt={currentTrack.title} 
                className="size-12 rounded-lg object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col justify-center overflow-hidden">
                <p className="text-sm font-bold truncate">{currentTrack.title}</p>
                <p className="text-xs text-text-muted truncate">{currentTrack.artist}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="size-3 text-text-muted" />
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1 bg-black/5 rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-2">
              <button onClick={prevTrack} className="text-text-muted hover:text-text-main transition"><SkipBack className="size-4" /></button>
              <button onClick={togglePlay} className="bg-text-main text-white rounded-full size-8 flex items-center justify-center hover:scale-105 transition">
                {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              </button>
              <button onClick={nextTrack} className="text-text-muted hover:text-text-main transition"><SkipForward className="size-4" /></button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative bg-bg-light">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 md:py-10 flex flex-col gap-10"
            >
              <header className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <h2 className="text-text-muted text-lg font-medium">{t.goodMorning}</h2>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight">{userName}</h1>
                  <p className="text-text-muted mt-2 font-medium">Tuesday, Oct 24</p>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`size-10 rounded-full border border-black/5 flex items-center justify-center transition relative ${isNotificationsOpen ? 'bg-primary text-text-main' : 'bg-white text-text-main hover:bg-black/5'}`}
                  >
                    <Bell className="size-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 size-3 bg-red-500 border-2 border-white rounded-full"></span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsNotificationsOpen(false)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-12 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-black/5 p-6 z-50"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">{t.notifications}</h3>
                            <button 
                              onClick={() => setNotifications([])}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              {t.clearAll}
                            </button>
                          </div>
                          <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2">
                            {notifications.length === 0 ? (
                              <p className="text-text-muted text-sm text-center py-4">{t.noNotifications}</p>
                            ) : (
                              notifications.map(n => (
                                <div key={n.id} className="flex flex-col gap-1 pb-3 border-b border-black/5 last:border-0">
                                  <p className="text-sm font-medium text-text-main">{n.text}</p>
                                  <span className="text-[10px] text-text-muted font-bold">{n.time}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  <img 
                    src={userPhoto || undefined} 
                    alt="User" 
                    className="size-10 rounded-full border-2 border-white shadow-sm object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </header>

              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: t.tasksPending, value: pendingTasksCount.toString(), change: 'Live', color: 'bg-primary/20' },
                  { label: t.focusTime, value: formatFocusTime(focusTime), change: 'Total', color: 'bg-green-100' },
                  { label: t.sessions, value: completedSessions.toString(), change: 'Done', color: 'bg-green-100' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-black/5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                      <span className={`${stat.color} text-xs px-2 py-1 rounded-full font-bold`}>{stat.change}</span>
                    </div>
                    <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                ))}
              </section>

              <section className="flex flex-col gap-5 pb-24">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{t.todaysTasks}</h3>
                  <button className="text-sm font-medium text-text-muted hover:text-text-main transition">{t.viewAll}</button>
                </div>
                <div className="flex flex-col gap-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`group flex flex-col sm:flex-row gap-4 bg-white px-6 py-5 rounded-2xl border border-transparent hover:border-black/5 shadow-sm hover:shadow-md transition-all duration-300 ${task.status === 'completed' ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`flex items-center justify-center rounded-xl shrink-0 size-12 transition-colors ${task.status === 'completed' ? 'bg-black/5 text-text-muted' : 'bg-bg-light text-text-main group-hover:bg-primary group-hover:text-text-main'}`}>
                          <IconComponent name={task.icon} className="size-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className={`text-lg font-bold leading-snug ${task.status === 'completed' ? 'line-through text-text-muted' : ''}`}>{task.title}</h4>
                          <p className={`text-text-muted text-sm leading-normal ${task.status === 'completed' ? 'line-through' : ''}`}>{task.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-block size-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{task.status}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        {task.status === 'pending' ? (
                          <button 
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              setCurrentView('configure');
                            }}
                            className="flex items-center justify-center gap-2 rounded-full h-10 px-5 bg-bg-light text-text-main text-sm font-bold transition hover:bg-primary w-full sm:w-auto"
                          >
                            <Play className="size-4 fill-current" />
                            <span>{t.startFocus}</span>
                          </button>
                        ) : (
                          <button className="flex items-center justify-center gap-2 rounded-full h-10 px-5 bg-transparent border border-black/5 text-text-muted text-sm font-medium transition hover:border-primary hover:text-primary w-full sm:w-auto">
                            <Plus className="size-4" />
                            <span>{t.repeat}</span>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="flex items-center justify-center rounded-full size-10 bg-white border border-black/5 text-text-muted hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                          title="Delete Task"
                        >
                          <X className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center size-16 rounded-full bg-primary text-text-main shadow-xl hover:scale-110 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group"
              >
                <Plus className="size-8 transition-transform group-hover:rotate-90" />
              </button>
            </motion.div>
          )}

          {currentView === 'timer' && (
            <motion.div 
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto w-full pb-24"
            >
              <div className="max-w-[960px] w-full flex flex-col items-center gap-2 px-4">
                <div className="text-center mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {timer.mode === 'work' ? t.focusSession : t.restSession}
                  </h1>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5">
                    <Check className={`size-4 ${timer.isActive ? 'text-primary' : 'text-text-muted'} fill-current`} />
                    <p className="text-text-muted text-sm font-medium">
                      {timer.mode === 'work' ? (activeTask ? activeTask.title : t.noTaskSelected) : t.takingBreak}
                    </p>
                  </div>
                </div>

                <div className="relative size-72 md:size-96 flex items-center justify-center mb-10">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      className="text-black/5" 
                      cx="50" cy="50" r="46" 
                      fill="none" stroke="currentColor" strokeWidth="3" 
                    />
                    <motion.circle 
                      cx="50" cy="50" r="46" 
                      fill="none" stroke={timer.mode === 'work' ? "#f9f506" : "#10b981"} strokeWidth="3" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "289", strokeDashoffset: "289" }}
                      animate={{ 
                        strokeDashoffset: 289 - (289 * (timer.totalSeconds / timer.initialSeconds))
                      }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-7xl md:text-8xl font-bold text-text-main tabular-nums tracking-tighter">
                      {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                    </span>
                    <span className="mt-4 text-text-muted font-medium text-sm uppercase tracking-widest">
                      {timer.mode === 'work' ? t.minutesRemaining : t.restTimeRemaining}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full max-w-md justify-center">
                  <button 
                    onClick={toggleTimer}
                    className="flex h-14 w-36 items-center justify-center rounded-full bg-primary text-text-main shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      {timer.isActive ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}
                      <span className="text-lg font-bold tracking-wide">{timer.isActive ? 'Pause' : 'Start'}</span>
                    </div>
                  </button>
                  <button 
                    onClick={resetTimer}
                    className="flex h-14 w-36 items-center justify-center rounded-full bg-white border border-black/5 text-text-main hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <StopCircle className="size-6" />
                      <span className="text-lg font-bold tracking-wide">Reset</span>
                    </div>
                  </button>
                </div>
                
                <div className="mt-8 flex gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`size-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-black/10'}`}></div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'configure' && (
            <motion.div 
              key="configure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-40 overflow-y-auto"
            >
              <div className="w-full max-w-[720px] flex flex-col gap-8">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-text-main text-3xl md:text-4xl font-black leading-tight tracking-tight">{t.configureSession}</h1>
                    <p className="text-text-muted text-base font-normal">Customize your audio environment and timer duration for deep work.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('home')}
                    className="flex items-center justify-center rounded-full size-10 bg-white border border-black/5 hover:bg-black/5 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <section className="flex flex-col gap-4">
                  <h2 className="text-text-main text-xl font-bold leading-tight tracking-tight">Select Task</h2>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.filter(t => t.status === 'pending').map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          selectedTaskId === task.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-black/5 bg-white hover:border-primary/30'
                        }`}
                      >
                        <div className={`size-8 rounded-lg flex items-center justify-center ${selectedTaskId === task.id ? 'bg-primary text-text-main' : 'bg-bg-light text-text-muted'}`}>
                          <IconComponent name={task.icon} className="size-4" />
                        </div>
                        <span className="font-bold text-sm text-left flex-1">{task.title}</span>
                        {selectedTaskId === task.id && <Check className="size-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <h2 className="text-text-main text-xl font-bold leading-tight tracking-tight">Select Atmosphere</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {ATMOSPHERES.map((atm) => (
                      <button
                        key={atm.id}
                        onClick={() => setSelectedAtmosphere(atm.id)}
                        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 h-32 transition-all duration-200 ${
                          selectedAtmosphere === atm.id 
                            ? 'border-primary bg-primary/10 shadow-lg' 
                            : 'border-black/5 bg-white hover:border-primary/50'
                        }`}
                      >
                        <IconComponent name={atm.icon} className={`size-8 ${selectedAtmosphere === atm.id ? 'text-text-main' : 'text-text-muted'}`} />
                        <span className="text-sm font-bold text-text-main">{atm.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 border border-black/5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-main text-base font-bold">Atmosphere Volume</span>
                    <span className="text-text-muted text-sm font-medium">{volume}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {volume === 0 ? <VolumeX className="size-5 text-text-muted" /> : <Volume2 className="size-5 text-text-muted" />}
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 h-2 bg-black/5 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <h2 className="text-text-main text-xl font-bold leading-tight tracking-tight">Focus Duration</h2>
                  <div className="flex flex-wrap gap-3">
                    {[25, 50].map(duration => (
                      <button
                        key={duration}
                        onClick={() => startSession(duration)}
                        className="flex-1 min-w-[100px] h-14 flex items-center justify-center rounded-xl border-2 border-black/5 bg-white text-text-main font-bold transition-all hover:border-primary"
                      >
                        {duration} min
                      </button>
                    ))}
                    <button className="flex-1 min-w-[100px] h-14 px-4 flex items-center justify-between rounded-xl border-2 border-black/5 bg-white text-text-main font-bold transition-all hover:border-primary">
                      <span>Custom</span>
                      <Edit2 className="size-4 text-text-muted" />
                    </button>
                  </div>
                </section>

                <button 
                  onClick={() => startSession(25)}
                  className="w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.99] transition-all rounded-full flex items-center justify-center gap-3 text-text-main text-lg font-bold shadow-lg shadow-primary/20"
                >
                  <Play className="size-6 fill-current" />
                  Start Focus Session
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'library' && (
            <motion.div 
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 md:py-10 flex flex-col gap-10"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black tracking-tight">{t.library}</h1>
                    <button 
                      onClick={() => setIsAddMusicModalOpen(true)}
                      className="flex items-center justify-center size-10 rounded-full bg-primary text-text-main shadow-lg hover:scale-110 transition-all"
                      title={t.addMusic}
                    >
                      <Plus className="size-6" />
                    </button>
                  </div>
                  <p className="text-text-muted font-medium">{t.youtubeLibraryDesc}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm flex items-center gap-4 min-w-[240px]">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t.atmosphere}</span>
                    <span className="text-sm font-bold">{ATMOSPHERES.find(a => a.id === selectedAtmosphere)?.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {ATMOSPHERES.map(atm => (
                      <button 
                        key={atm.id}
                        onClick={() => setSelectedAtmosphere(atm.id)}
                        className={`size-8 rounded-lg flex items-center justify-center transition-all ${selectedAtmosphere === atm.id ? 'bg-primary text-text-main' : 'bg-bg-light text-text-muted hover:bg-black/5'}`}
                      >
                        <IconComponent name={atm.icon} className="size-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <section className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold px-2">{t.styles}</h3>
                    <div className="flex flex-wrap gap-2">
                      {styles.map(style => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(style || 'All')}
                          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${selectedStyle === style ? 'bg-text-main text-white' : 'bg-white border border-black/5 text-text-muted hover:border-primary'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTracks.map((track) => {
                      const isCurrent = currentTrack.id === track.id;
                      return (
                        <button
                          key={track.id}
                          onClick={() => {
                            const index = musicTracks.findIndex(t => t.id === track.id);
                            setCurrentTrackIndex(index);
                            setIsPlaying(true);
                          }}
                          className={`group flex items-center gap-4 p-4 rounded-3xl transition-all ${
                            isCurrent 
                              ? 'bg-primary/20 border-primary/20' 
                              : 'bg-white border-black/5 hover:border-primary/30 hover:shadow-md'
                          } border-2 text-left`}
                        >
                          <div className="relative size-16 shrink-0">
                            <img src={track.coverUrl || undefined} alt={track.title} className="size-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                            {isCurrent && isPlaying && (
                              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                <div className="flex gap-1 items-end h-4">
                                  <div className="w-1 bg-primary animate-[bounce_0.6s_infinite_0.1s]"></div>
                                  <div className="w-1 bg-primary animate-[bounce_0.6s_infinite_0.2s]"></div>
                                  <div className="w-1 bg-primary animate-[bounce_0.6s_infinite_0.3s]"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col overflow-hidden flex-1">
                            <span className="font-bold text-base truncate">{track.title}</span>
                            <span className="text-xs text-text-muted font-medium">{track.artist}</span>
                            <span className="mt-2 text-[10px] font-bold text-primary uppercase tracking-widest">{track.style}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-text-main text-white rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{t.playingNow}</span>
                      <Headphones className="size-4 opacity-50" />
                    </div>
                    <img src={currentTrack.coverUrl || undefined} alt={currentTrack.title} className="w-full aspect-square rounded-2xl object-cover shadow-lg" referrerPolicy="no-referrer" />
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-black truncate">{currentTrack.title}</h2>
                      <p className="font-medium opacity-70 truncate">{currentTrack.artist}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button onClick={prevTrack} className="hover:scale-110 transition"><SkipBack className="size-6" /></button>
                      <button 
                        onClick={togglePlay} 
                        className="size-16 rounded-full bg-primary text-text-main flex items-center justify-center hover:scale-105 transition shadow-xl shadow-primary/20"
                      >
                        {isPlaying ? <Pause className="size-8 fill-current" /> : <Play className="size-8 fill-current ml-1" />}
                      </button>
                      <button onClick={nextTrack} className="hover:scale-110 transition"><SkipForward className="size-6" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[800px] mx-auto px-6 py-8 md:px-12 md:py-10 flex flex-col gap-10"
            >
              <header>
                <h1 className="text-4xl font-black tracking-tight">{t.settings}</h1>
                <p className="text-text-muted mt-2 font-medium">Manage your account and preferences.</p>
              </header>

              <div className="grid grid-cols-1 gap-8">
                <section className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col gap-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="size-5 text-primary" />
                    {t.accountPhoto}
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img 
                        src={tempPhoto || userPhoto || undefined} 
                        alt="User" 
                        className={`size-24 rounded-full border-4 shadow-md object-cover transition-all ${tempPhoto ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-white'}`}
                        referrerPolicy="no-referrer"
                      />
                      {tempPhoto && (
                        <div className="absolute -top-2 -right-2 bg-primary text-text-main text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-bounce">
                          Preview
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <label className="text-sm font-bold text-text-muted">{t.changePhoto}</label>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      {!tempPhoto ? (
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-12 px-6 rounded-xl border-2 border-black/5 bg-white hover:border-primary hover:bg-primary/5 text-text-main font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="size-5" />
                          {t.changePhoto}
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={confirmPhoto}
                            className="flex-1 h-12 px-4 rounded-xl bg-primary text-text-main font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                          >
                            <Check className="size-4" />
                            {t.confirmPhoto}
                          </button>
                          <button 
                            onClick={cancelPhoto}
                            className="h-12 px-4 rounded-xl border-2 border-black/5 bg-white hover:bg-red-50 hover:text-red-500 hover:border-red-200 text-text-muted font-bold transition-all flex items-center justify-center"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-muted">Display Name</label>
                    <input 
                      type="text"
                      value={userName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all"
                    />
                    <p className="text-[10px] text-text-muted italic ml-1">* Stored in cookies</p>
                  </div>
                </section>

                <section className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col gap-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="size-5 text-primary" />
                    {t.language}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'en', label: 'English', flag: '🇺🇸' },
                      { id: 'pt', label: 'Português', flag: '🇧🇷' },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id as 'en' | 'pt')}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${
                          language === lang.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-black/5 hover:border-primary/30'
                        }`}
                      >
                        <span className="font-bold">{lang.label}</span>
                        <span className="text-2xl">{lang.flag}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Task Modal */}
        <AnimatePresence>
          {isAddMusicModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddMusicModalOpen(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-black/5"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-text-main">{t.addMusic}</h2>
                  <button 
                    onClick={() => setIsAddMusicModalOpen(false)}
                    className="size-10 rounded-full flex items-center justify-center hover:bg-black/5 transition"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addMusicTrack(
                    formData.get('title') as string, 
                    formData.get('artist') as string,
                    formData.get('youtubeId') as string,
                    formData.get('style') as string
                  );
                }}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-text-muted ml-1">{t.musicTitle}</label>
                      <input 
                        name="title"
                        required
                        autoFocus
                        placeholder="Ex: Lofi Hip Hop"
                        className="w-full h-12 px-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-text-muted ml-1">{t.artistName}</label>
                      <input 
                        name="artist"
                        required
                        placeholder="Ex: ChilledCow"
                        className="w-full h-12 px-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-text-muted ml-1">{t.youtubeId}</label>
                      <input 
                        name="youtubeId"
                        required
                        placeholder="Ex: jfKfPfyJRdk"
                        className="w-full h-12 px-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-text-muted ml-1">{t.style}</label>
                      <input 
                        name="style"
                        required
                        placeholder="Ex: Lo-Fi"
                        className="w-full h-12 px-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full h-14 bg-primary hover:bg-primary/90 rounded-full font-bold text-text-main shadow-lg shadow-primary/20 transition-all active:scale-95 mt-2"
                    >
                      {t.createMusic}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAddTaskModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddTaskModalOpen(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-black/5"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-text-main">New Task</h2>
                  <button 
                    onClick={() => setIsAddTaskModalOpen(false)}
                    className="size-10 rounded-full flex items-center justify-center hover:bg-black/5 transition"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addTask(formData.get('title') as string, formData.get('description') as string);
                }}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-text-muted ml-1">Task Title</label>
                      <input 
                        name="title"
                        required
                        autoFocus
                        placeholder="What are you working on?"
                        className="w-full h-12 px-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-text-muted ml-1">Description</label>
                      <textarea 
                        name="description"
                        placeholder="Add some details..."
                        className="w-full h-32 p-4 rounded-xl border-2 border-black/5 focus:border-primary focus:outline-none transition-all resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full h-14 bg-primary hover:bg-primary/90 rounded-full font-bold text-text-main shadow-lg shadow-primary/20 transition-all active:scale-95 mt-2"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Music Player (Sticky Bottom) */}
        {['home', 'timer'].includes(currentView) && (
          <div className="fixed bottom-0 left-0 right-0 z-30 md:left-80">
            <div className="mx-auto max-w-3xl mb-6 px-4">
              <div className="bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-black/5 p-3 pr-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img 
                    src={currentTrack.coverUrl || undefined} 
                    alt={currentTrack.title} 
                    className="size-14 rounded-full object-cover shadow-lg animate-[spin_8s_linear_infinite]"
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-black text-text-main truncate max-w-[120px] md:max-w-[200px]">{currentTrack.title}</p>
                    <p className="text-xs text-text-muted font-medium truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                  <button onClick={prevTrack} className="text-text-muted hover:text-text-main transition p-2"><SkipBack className="size-5" /></button>
                  <button 
                    onClick={togglePlay} 
                    className="bg-text-main text-white rounded-full size-12 flex items-center justify-center hover:scale-105 transition shadow-lg"
                  >
                    {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current ml-1" />}
                  </button>
                  <button onClick={nextTrack} className="text-text-muted hover:text-text-main transition p-2"><SkipForward className="size-5" /></button>
                </div>

                <div className="hidden sm:flex items-center gap-3 min-w-[120px]">
                  {volume === 0 ? <VolumeX className="size-4 text-text-muted" /> : <Volume2 className="size-4 text-text-muted" />}
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 bg-black/5 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Persistent YouTube Player (Hidden) */}
        <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
          {currentTrack.youtubeId && (
            <iframe 
              ref={youtubePlayerRef}
              width="100" 
              height="100" 
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=${isPlaying ? '1' : '0'}&controls=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3`}
              title="YouTube background player" 
              frameBorder="0" 
              allow="autoplay"
            ></iframe>
          )}
          {getAtmosphereAudioUrl(selectedAtmosphere) && (
            <audio 
              ref={atmosphereAudioRef}
              src={getAtmosphereAudioUrl(selectedAtmosphere) || undefined}
              loop
            />
          )}
          <audio 
            ref={notificationAudioRef}
            src="https://www.soundjay.com/buttons/beep-07a.mp3"
          />
        </div>
      </main>
    </div>
  );
}
