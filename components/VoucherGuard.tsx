
import React, { useState, useEffect } from 'react';
import { ShieldAlert, KeyRound, Clock, Lock, X, AlertTriangle } from 'lucide-react';
import AdminPanel from './AdminPanel';
import Logo from './Logo';

interface VoucherGuardProps {
  children: React.ReactNode;
}

const VoucherGuard: React.FC<VoucherGuardProps> = ({ children }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    checkVoucher();
    const interval = setInterval(checkVoucher, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkVoucher = () => {
    const saved = localStorage.getItem('rotalog_access');
    if (saved) {
      const data = JSON.parse(saved);
      const now = Date.now();
      if (now < data.expiresAt) {
        setIsValid(true);
        const remaining = data.expiresAt - now;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        localStorage.removeItem('rotalog_access');
        setIsValid(false);
      }
    }
  };

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Recupera a "base de dados" de vouchers
    const adminVouchers = JSON.parse(localStorage.getItem('admin_vouchers') || '[]');
    const detailedVouchers = JSON.parse(localStorage.getItem('admin_vouchers_detailed') || '[]');
    
    const codeToValidate = voucherCode.trim().toUpperCase();

    // Verifica se o código existe na lista de vouchers NÃO UTILIZADOS
    if (adminVouchers.includes(codeToValidate)) {
      // 1. QUEIMA O VOUCHER IMEDIATAMENTE (Uso Único)
      // Removemos da lista ANTES de dar o acesso para garantir que mesmo um crash não permita reuso
      const updatedList = adminVouchers.filter((c: string) => c !== codeToValidate);
      const updatedDetailed = detailedVouchers.filter((v: any) => v.code !== codeToValidate);

      localStorage.setItem('admin_vouchers', JSON.stringify(updatedList));
      localStorage.setItem('admin_vouchers_detailed', JSON.stringify(updatedDetailed));

      // 2. Cria a sessão de 6 horas para o navegador atual
      const expiry = Date.now() + (6 * 60 * 60 * 1000); 
      localStorage.setItem('rotalog_access', JSON.stringify({ 
        expiresAt: expiry,
        activatedCode: codeToValidate 
      }));

      // 3. Notifica outros componentes/abas sobre a queima do voucher
      window.dispatchEvent(new Event('srl_data_update'));

      setIsValid(true);
      setError('');
    } else {
      setError('Este voucher já foi utilizado, está incorreto ou expirou.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais de Admin Padrão
    if (adminUser === '123456' && adminPass === '123456') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminError('');
      setAdminUser('');
      setAdminPass('');
    } else {
      setAdminError('Credenciais incorretas.');
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <AdminPanel onBack={() => setIsAdmin(false)} />
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-300/20 rounded-full blur-3xl"></div>

        <button 
          onClick={() => setShowAdminLogin(true)}
          className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-widest transition-all backdrop-blur-sm z-20"
        >
          <Lock size={12} /> Painel Admin
        </button>

        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center text-center mb-10">
            <Logo size="lg" className="mb-6" />
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Portal do Motorista</h1>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Acesso de Uso Único (6 Horas)</p>
          </div>

          <form onSubmit={handleVoucherSubmit} className="space-y-6">
            <div className="relative group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Código Voucher</label>
              <div className="relative">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="DIGITE SEU CÓDIGO"
                  className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-black tracking-[0.3em] text-center text-xl text-slate-800"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-3 text-red-600 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake">
                <ShieldAlert size={18} />
                {error}
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              Ativar e Acessar
              <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                <Clock size={14} />
              </div>
            </button>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
              <AlertTriangle className="text-amber-500 shrink-0" size={16} />
              <p className="text-[9px] text-amber-700 font-bold uppercase leading-tight">
                Importante: Ao sair da sessão, este voucher será permanentemente invalidado e não poderá ser usado novamente.
              </p>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] text-slate-300 uppercase tracking-[0.4em] font-black">SRL • Logística Inteligente &copy; 2025</p>
          </div>
        </div>

        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-slate-200 relative">
              <button onClick={() => setShowAdminLogin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Lock size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase">Autenticação</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Acesso Administrativo SRL</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="USUÁRIO"
                  value={adminUser}
                  onChange={e => setAdminUser(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold uppercase text-xs tracking-widest"
                  required
                />
                <input 
                  type="password" 
                  placeholder="SENHA"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold uppercase text-xs tracking-widest"
                  required
                />
                {adminError && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-100 text-center uppercase tracking-tighter">{adminError}</p>}
                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Acessar Painel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 pointer-events-none sm:pointer-events-auto">
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-slate-700 backdrop-blur-md bg-opacity-90">
          <Clock size={14} className="text-blue-400" />
          Sessão expira em: <span className="text-blue-400">{timeLeft}</span>
        </div>
      </div>
      {children}
    </>
  );
};

export default VoucherGuard;
