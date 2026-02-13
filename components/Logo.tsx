
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} aspect-square bg-gradient-to-br from-blue-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group`}>
        {/* Stylized road lines in background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white -rotate-45 translate-y-2"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white -rotate-45 -translate-y-4"></div>
        </div>
        <span className="text-white font-black tracking-tighter text-xl relative z-10">SRL</span>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 group-hover:bg-blue-300 transition-colors"></div>
      </div>
      {size !== 'lg' && (
        <div className="flex flex-col">
          <span className="font-black text-slate-900 tracking-tight leading-none text-lg">SISTEMA DE ROTA</span>
          <span className="font-bold text-blue-600 tracking-[0.2em] text-[10px] leading-none mt-1">LOGÍSTICA</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
