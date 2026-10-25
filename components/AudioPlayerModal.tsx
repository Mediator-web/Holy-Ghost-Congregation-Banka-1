'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sermon } from '../types/pcg';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  X,
  FastForward,
  Check,
} from 'lucide-react';
import { formatAudioDuration } from '../lib/pcg-logic';

interface AudioPlayerModalProps {
  sermon: Sermon | null;
  onClose: () => void;
}

export function AudioPlayerModal({ sermon, onClose }: AudioPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (sermon) {
      setCurrentTime(0);
      setIsPlaying(true);
      setDuration(sermon.durationSeconds || 1800);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Autoplay policy fallback
          setIsPlaying(false);
        });
      }
    }
  }, [sermon]);

  if (!sermon) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleRewind10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 1.75];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#0B3056] text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-700 relative overflow-hidden">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={sermon.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close audio player"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#C41230] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Audio Sermon
          </span>
          <span className="text-xs text-amber-300 font-medium">
            {sermon.presbytery} • {sermon.category}
          </span>
        </div>

        {/* Sermon Title & Preacher */}
        <div className="mb-6">
          <h3 className="text-xl font-bold font-serif text-white leading-snug line-clamp-2">
            {sermon.title}
          </h3>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            {sermon.speaker} <span className="text-xs text-amber-400">({sermon.speakerRole})</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Scripture: {sermon.scripture} • Theme: {sermon.theme}
          </p>
        </div>

        {/* Progress Slider */}
        <div className="space-y-1.5 mb-6">
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-[#C41230] rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek sermon audio playback"
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{formatAudioDuration(currentTime)}</span>
            <span>{formatAudioDuration(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={cycleSpeed}
              className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono font-bold text-amber-300 hover:bg-slate-700 transition-colors"
              title="Playback Speed"
            >
              {playbackRate}x
            </button>

            <button
              onClick={handleRewind10}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Center Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#C41230] hover:bg-[#a50f28] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? 'Pause sermon' : 'Play sermon'}
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-0.5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#C41230]" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
              title="Share Sermon Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {sermon.audioUrl && (
              <a
                href={sermon.audioUrl}
                download={`${sermon.title}.mp3`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Download Audio MP3"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
