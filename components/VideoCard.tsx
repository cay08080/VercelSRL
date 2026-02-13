import React, { useState, useRef, useEffect } from 'react';
import { Play, Calendar, ChevronRight, X, RotateCcw, Loader2 } from 'lucide-react';
import { VideoRoute } from '../types';
import { getVideoFile } from '../db';

interface VideoCardProps {
  video: VideoRoute;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>(video.videoUrl);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadVideo = async () => {
      if (video.videoUrl.startsWith('indexeddb://')) {
        setIsLoading(true);
        const id = video.videoUrl.replace('indexeddb://', '');
        const file = await getVideoFile(id);
        if (file) {
          setVideoSrc(URL.createObjectURL(file));
        }
        setIsLoading(false);
      } else {
        setVideoSrc(video.videoUrl);
      }
    };
    if (isOpen) {
      loadVideo();
    }
    return () => {
      if (videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [isOpen, video.videoUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpen = () => {
    const progress = localStorage.getItem(`video_progress_${video.id}`);
    if (progress && parseFloat(progress) > 5) {
      setSavedTime(parseFloat(progress));
      setShowResumePrompt(true);
    } else {
      setIsOpen(true);
    }
  };

  const startFromTime = (time: number) => {
    setIsOpen(true);
    setShowResumePrompt(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }, 500);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(`video_progress_${video.id}`, videoRef.current.currentTime.toString());
    }
  };

  return (
    <>
      <div 
        onClick={handleOpen}
        className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all cursor-pointer animate-in fade-in zoom-in duration-500"
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform border border-white/30">
              <Play className="text-white fill-white ml-1" size={32} />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-widest">
            {video.duration}
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-3">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{video.updatedAt}</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
            {video.description}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Visualização Interna
            </span>
            <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
          </div>
        </div>
      </div>

      {/* Resume Prompt Modal */}
      {showResumePrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border border-slate-200">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <RotateCcw size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Retomar Vídeo?</h3>
            <p className="text-slate-500 text-sm font-medium mt-3 mb-8">
              Você já assistiu até <strong>{formatTime(savedTime)}</strong>. Como deseja continuar?
            </p>
            <div className="grid gap-3">
              <button 
                onClick={() => startFromTime(savedTime)}
                className="w-full py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
              >
                Retomar de {formatTime(savedTime)}
              </button>
              <button 
                onClick={() => startFromTime(0)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
              >
                Recomeçar do Início
              </button>
              <button 
                onClick={() => setShowResumePrompt(false)}
                className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] mt-2 py-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-3 bg-white/5 rounded-2xl hover:bg-white/10 z-50 border border-white/5"
          >
            <X size={32} />
          </button>
          
          <div className="w-full max-w-6xl flex flex-col items-center">
            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-white/10 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="animate-spin text-white" size={48} />
                </div>
              )}
              <video 
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain"
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                playsInline
              />
            </div>
            <div className="mt-8 text-center max-w-2xl px-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{video.title}</h2>
              <p className="text-white/50 mt-2 text-sm font-medium leading-relaxed">{video.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;