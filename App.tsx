import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoucherGuard from './components/VoucherGuard';
import VideoCard from './components/VideoCard';
import Logo from './components/Logo';
import { CATEGORIES, MOCK_VIDEOS } from './constants';
import { CategoryId, VideoRoute, Notice } from './types';
import { Info, Bell, Search, UserCircle2, Truck, PlayCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryId>('inicio');
  const [allVideos, setAllVideos] = useState<VideoRoute[]>(MOCK_VIDEOS);
  const [notices, setNotices] = useState<Notice[]>([]);

  const refreshData = () => {
    const custom = JSON.parse(localStorage.getItem('custom_videos') || '[]');
    setAllVideos([...MOCK_VIDEOS, ...custom]);

    const savedNotices = JSON.parse(localStorage.getItem('srl_notices') || '[]');
    setNotices(savedNotices);
  };

  useEffect(() => {
    refreshData();
    
    // Listen for custom update events from AdminPanel
    window.addEventListener('srl_data_update', refreshData);
    return () => window.removeEventListener('srl_data_update', refreshData);
  }, []);

  const filteredVideos = allVideos.filter(video => video.categoryId === activeTab);
  const currentCategoryName = CATEGORIES.find(c => c.id === activeTab)?.name || '';

  const renderContent = () => {
    if (activeTab === 'inicio') {
      const welcomeVideos = allVideos.filter(v => v.categoryId === 'inicio');
      
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative w-36 h-36 bg-slate-50 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden shrink-0">
              <img src="https://picsum.photos/seed/truckdriver/400/400" alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1 relative z-10">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">BEM-VINDO, MOTORISTA</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mt-1">Terminal Industrial Integrado • Sessão Protegida</p>
              
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  Acesso Autorizado
                </div>
                <div className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  <Truck size={14} />
                  Perfil Verificado
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                  <PlayCircle className="text-blue-600" size={28} /> 
                  <span className="tracking-tight">Roteiros de Boas-Vindas</span>
                </h3>
              </div>
              
              {welcomeVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {welcomeVideos.map(v => <VideoCard key={v.id} video={v} />)}
                </div>
              ) : (
                <div className="bg-slate-50/50 p-12 rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
                  <PlayCircle className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhuma instrução configurada</p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Info size={100} />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Segurança do Terminal</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100/50">
                      <Info size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Atenção Crítica</p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Utilize sempre a visão interna da cabine nos pontos de conversão.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Informativos SRL Ativos</h4>
                
                {notices.length > 0 ? (
                  notices.map(notice => (
                    <div key={notice.id} className={`p-8 rounded-[2rem] shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02] ${
                      notice.type === 'alert' ? 'bg-gradient-to-br from-red-700 to-red-600 text-white' : 
                      notice.type === 'warning' ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 
                      'bg-gradient-to-br from-blue-700 to-blue-600 text-white'
                    }`}>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-[40px]"></div>
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                          {notice.type === 'alert' ? <AlertTriangle size={20} /> : notice.type === 'warning' ? <Bell size={20} /> : <Info size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight">{notice.title}</p>
                          <p className="text-xs text-white/80 font-medium leading-relaxed mt-1">{notice.message}</p>
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-3 block">{notice.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-100 p-8 rounded-[2rem] border border-slate-200 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum informativo novo</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{currentCategoryName}</h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Visão de Cabine • Roteiro Industrial Específico</p>
          </div>
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar ponto de referência..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold tracking-tight"
            />
          </div>
        </header>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-24 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
              <Truck size={48} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Roteiros em Preparação</h3>
            <p className="text-slate-400 mt-3 max-w-sm mx-auto font-bold uppercase tracking-widest text-[10px]">Novos conteúdos para o setor de {currentCategoryName} serão adicionados em breve.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <VoucherGuard>
      <div className="flex min-h-screen bg-slate-50 font-inter">
        <Sidebar activeTab={activeTab} onTabChange={(id) => setActiveTab(id)} />
        
        <main className="flex-1 p-4 sm:p-10 pb-28 md:pb-10 max-w-[1400px] mx-auto w-full overflow-x-hidden">
          <div className="md:hidden flex flex-col items-center mb-10 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
             <Logo size="md" />
             <div className="w-full h-px bg-slate-100"></div>
             <div className="flex items-center justify-between w-full">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Painel do Condutor</p>
                <button onClick={() => setActiveTab('inicio')} className="p-2 bg-slate-50 rounded-xl text-slate-400"><UserCircle2 size={20} /></button>
             </div>
          </div>

          {renderContent()}

          <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">SISTEMA DE ROTA LOGÍSTICA &copy; 2025</p>
            </div>
          </footer>
        </main>
      </div>
    </VoucherGuard>
  );
};

export default App;