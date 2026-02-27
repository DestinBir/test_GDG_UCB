import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "CYBER_PULSE_V1",
    artist: "AI_CORE_ALPHA",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-city-110210.mp3",
    duration: "2:15"
  },
  {
    id: 2,
    title: "NEON_HORIZON_ERR",
    artist: "AI_CORE_BETA",
    url: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_1997235025.mp3?filename=synthwave-80s-110045.mp3",
    duration: "1:45"
  },
  {
    id: 3,
    title: "DIGITAL_RAIN_0X",
    artist: "AI_CORE_GAMMA",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_55b8d2346e.mp3?filename=retro-game-music-109590.mp3",
    duration: "2:30"
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md p-4 border-2 border-[#ff00ff] bg-black relative overflow-hidden group">
      {/* Glitch Overlay on Hover */}
      <div className="absolute inset-0 bg-[#ff00ff] opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-100 mix-blend-difference"></div>

      <div className="relative z-10 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-[#ff00ff]/30 pb-2">
           <div className="text-[#ff00ff] text-xl font-bold uppercase glitch" data-text="NOW_PLAYING">NOW_PLAYING</div>
           <div className={`w-2 h-2 ${isPlaying ? 'bg-[#00ffff] animate-ping' : 'bg-red-500'}`}></div>
        </div>
        
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#00ffff] mb-1 uppercase tracking-tighter truncate">{currentTrack.title}</h2>
          <p className="text-lg text-[#ff00ff] font-mono uppercase tracking-widest">{currentTrack.artist}</p>
        </div>

        {/* Visualizer (Fake) */}
        <div className="flex items-end justify-center gap-1 h-16 mb-6 border-x border-[#00ffff]/20 px-4">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="w-full bg-[#00ffff]"
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '5%',
                opacity: isPlaying ? 0.8 : 0.2,
                transition: 'height 0.1s ease'
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <button onClick={prevTrack} className="text-[#ff00ff] hover:text-white hover:bg-[#ff00ff] p-2 border border-[#ff00ff] transition-all active:translate-y-1">
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="flex-1 h-12 border-2 border-[#00ffff] flex items-center justify-center text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all uppercase font-bold tracking-widest shadow-[4px_4px_0px_#ff00ff] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>

          <button onClick={nextTrack} className="text-[#ff00ff] hover:text-white hover:bg-[#ff00ff] p-2 border border-[#ff00ff] transition-all active:translate-y-1">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#00ffff]">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex-1 h-4 border border-[#ff00ff] p-0.5">
             <div 
               className="h-full bg-[#ff00ff] relative"
               style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
             >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white"></div>
             </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="absolute opacity-0 w-full h-8 cursor-pointer"
          />
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
    </div>
  );
}
