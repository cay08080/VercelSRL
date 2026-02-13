
import React from 'react';
import { LogOut, Truck, Power, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { CategoryId } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeTab: CategoryId;
  onTabChange: (id: CategoryId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "ATENÇÃO: Ao finalizar a sessão agora, este voucher será invalidado permanentemente. Você não poderá entrar novamente com o mesmo código.\n\nDeseja mesmo sair?"
    );
    
    if (confirmLogout) {
      // Remove o token de acesso
      localStorage.removeItem('rotalog_access');
      // Recarrega a aplicação para voltar ao VoucherGuard
      window.location.reload();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0 z-30">
        <div className="p-8 border-b border-slate-100">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-5 space-y-1.5 mt-6">
          <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Módulos de Rota</p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onTabChange(cat.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all group ${
                activeTab === cat.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === cat.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
                {cat.icon}
              </span>
              {cat.name}
              {activeTab === cat.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="mb-4 px-4">
             <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3">
                <AlertTriangle size={14} className="text-red-500 shrink-0" />
                <p className="text-[8px] font-black text-red-700 uppercase leading-tight">Voucher de uso único. Sair encerrará o acesso.</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-red-100/50 bg-red-50/20"
          >
            <Power size={18} />
            Finalizar Sessão
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-2 py-4 z-40 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onTabChange(cat.id)}
            className={`flex flex-col items-center gap-1.5 min-w-[56px] transition-all ${
              activeTab === cat.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`p-2.5 rounded-xl transition-all ${activeTab === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' : 'bg-slate-50'}`}>
              {React.cloneElement(cat.icon as React.ReactElement, { size: 18 })}
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter truncate max-w-[50px]">
              {cat.id === 'placa-bloco-tarugo' ? 'PBT' : cat.name}
            </span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1.5 min-w-[56px] text-red-500"
        >
          <div className="p-2.5 rounded-xl bg-red-50">
            <Power size={18} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-tighter">Sair</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
