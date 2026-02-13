import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Copy, X, ArrowLeft, Printer, FileVideo, Loader2, Bell, AlertTriangle, Info as InfoIcon, Edit2 } from 'lucide-react';
import { CategoryId, VideoRoute, Notice } from '../types';
import { CATEGORIES, MOCK_VIDEOS } from '../constants';
import { saveVideoFile } from '../db';
import Logo from './Logo';

interface VoucherData {
  code: string;
  createdAt: string;
  expiresAt: string;
}

interface AdminPanelProps {
  onBack?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'videos' | 'notices'>('vouchers');
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [videos, setVideos] = useState<VideoRoute[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '', 
    thumbnail: '',
    categoryId: 'inicio' as CategoryId,
    duration: '0:00'
  });

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: '',
    type: 'info' as Notice['type']
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const savedVouchers = JSON.parse(localStorage.getItem('admin_vouchers_detailed') || '[]');
    setVouchers(savedVouchers);
    const savedVideos = JSON.parse(localStorage.getItem('custom_videos') || '[]');
    setVideos([...MOCK_VIDEOS, ...savedVideos]);
    const savedNotices = JSON.parse(localStorage.getItem('srl_notices') || '[]');
    setNotices(savedNotices);
  };

  const notifyUpdate = () => {
    window.dispatchEvent(new Event('srl_data_update'));
  };

  const generateVoucher = () => {
    const code = 'ROTA' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = new Date();
    const expiry = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    
    const newVoucher: VoucherData = {
      code,
      createdAt: now.toLocaleString('pt-BR'),
      expiresAt: expiry.toLocaleString('pt-BR')
    };

    const updated = [newVoucher, ...vouchers];
    setVouchers(updated);
    localStorage.setItem('admin_vouchers_detailed', JSON.stringify(updated));
    localStorage.setItem('admin_vouchers', JSON.stringify(updated.map(v => v.code)));
  };

  const removeVoucher = (code: string) => {
    const updated = vouchers.filter(v => v.code !== code);
    setVouchers(updated);
    localStorage.setItem('admin_vouchers_detailed', JSON.stringify(updated));
    localStorage.setItem('admin_vouchers', JSON.stringify(updated.map(v => v.code)));
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado!');
  };

  const printVoucher = (v: VoucherData) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '100%';
    iframe.style.bottom = '100%';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.write(`
      <html>
        <head>
          <style>
            @page { size: auto; margin: 0; }
            body { font-family: sans-serif; margin: 0; padding: 10px; display: flex; justify-content: center; }
            .ticket { border: 2px solid #000; padding: 15px; width: 180px; text-align: center; background: white; }
            .logo { font-size: 20px; font-weight: 900; border-bottom: 2px solid #000; margin-bottom: 5px; padding-bottom: 2px; }
            .code { border: 2px solid #000; padding: 10px; margin: 10px 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; }
            .info { font-size: 10px; text-align: left; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body onload="window.print();">
          <div class="ticket">
            <div class="logo">SRL</div>
            <div style="font-size: 7px; font-weight: bold; margin-bottom: 5px;">SISTEMA DE ROTA LOGÍSTICA</div>
            <div class="code">${v.code}</div>
            <div class="info">
              <div><b>EMISSÃO:</b> ${v.createdAt.split(' ')[0]}</div>
              <div style="margin-top:4px"><b>VALIDADE:</b> EXPIRA EM 6 HORAS</div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Remove the iframe after printing (give it a few seconds)
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);
  };

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const id = "vid_" + Date.now();
    let finalVideoUrl = newVideo.videoUrl;

    if (videoFile) {
      try {
        await saveVideoFile(id, videoFile);
        finalVideoUrl = 'indexeddb://' + id;
      } catch (err) {
        alert('Erro ao processar vídeo.');
        setIsUploading(false);
        return;
      }
    }

    const videoToAdd: VideoRoute = {
      ...newVideo,
      id,
      videoUrl: finalVideoUrl,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      thumbnail: newVideo.thumbnail || `https://picsum.photos/seed/${id}/800/450`
    };

    const customVideos = JSON.parse(localStorage.getItem('custom_videos') || '[]');
    const updatedCustom = [...customVideos, videoToAdd];
    localStorage.setItem('custom_videos', JSON.stringify(updatedCustom));
    
    refreshData();
    notifyUpdate();
    setIsUploading(false);
    setShowAddVideo(false);
    setVideoFile(null);
    setNewVideo({ title: '', description: '', videoUrl: '', thumbnail: '', categoryId: 'inicio', duration: '0:00' });
  };

  const removeVideo = (id: string) => {
    if(!confirm('Excluir este vídeo?')) return;
    const customVideos = JSON.parse(localStorage.getItem('custom_videos') || '[]');
    const updatedCustom = customVideos.filter((v: VideoRoute) => v.id !== id);
    localStorage.setItem('custom_videos', JSON.stringify(updatedCustom));
    refreshData();
    notifyUpdate();
  };

  const saveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedNotices: Notice[];
    if (editingNoticeId) {
      updatedNotices = notices.map(n => n.id === editingNoticeId ? { ...n, ...noticeForm } : n);
    } else {
      updatedNotices = [{ id: Date.now().toString(), ...noticeForm, createdAt: new Date().toLocaleString('pt-BR') }, ...notices];
    }
    setNotices(updatedNotices);
    localStorage.setItem('srl_notices', JSON.stringify(updatedNotices));
    notifyUpdate();
    setShowNoticeModal(false);
    setEditingNoticeId(null);
    setNoticeForm({ title: '', message: '', type: 'info' });
  };

  const removeNotice = (id: string) => {
    if(!confirm('Excluir este aviso?')) return;
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    localStorage.setItem('srl_notices', JSON.stringify(updated));
    notifyUpdate();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-20 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-6">
          <button onClick={() => { notifyUpdate(); onBack?.(); }} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-500 transition-all border border-transparent hover:border-slate-200"><ArrowLeft size={20} /></button>
          <Logo size="md" />
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('vouchers')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vouchers' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Vouchers</button>
          <button onClick={() => setActiveTab('videos')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Vídeos</button>
          <button onClick={() => setActiveTab('notices')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'notices' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Avisos</button>
        </div>
      </div>

      {activeTab === 'vouchers' ? (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div><h2 className="text-3xl font-black text-slate-900 uppercase">Vouchers</h2><p className="text-slate-400 text-xs font-bold uppercase mt-1">Gestão de acesso rápido</p></div>
            <button onClick={generateVoucher} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-xl transition-all"><Plus size={20} /> Novo</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vouchers.map((v) => (
              <div key={v.code} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-4 group hover:bg-white hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-blue-600"><CheckCircle2 size={20} /></div>
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(v.code)} className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm"><Copy size={16} /></button>
                    <button onClick={() => printVoucher(v)} className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm"><Printer size={16} /></button>
                    <button onClick={() => removeVoucher(v.code)} className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-100 shadow-sm"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div><span className="block text-2xl font-black text-slate-900 tracking-[0.2em]">{v.code}</span><div className="text-[9px] text-slate-400 font-black uppercase mt-1">Expira em 6h</div></div>
                <button onClick={() => printVoucher(v)} className="w-full py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><Printer size={14} /> Imprimir</button>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'videos' ? (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div><h2 className="text-3xl font-black text-slate-900 uppercase">Rotas</h2><p className="text-slate-400 text-xs font-bold uppercase mt-1">Visão de cabine</p></div>
            <button onClick={() => setShowAddVideo(true)} className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all"><Plus size={20} /> Novo Vídeo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-100"><th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Prévia</th><th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Setor</th><th className="pb-6 text-[10px] font-black text-slate-400 uppercase text-right pr-4">Ação</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {videos.map((v) => (
                  <tr key={v.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 pl-4"><div className="flex items-center gap-4"><img src={v.thumbnail} className="w-16 h-10 object-cover rounded-lg" /><span className="text-sm font-black text-slate-800 uppercase">{v.title}</span></div></td>
                    <td><span className="text-[9px] font-black px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase">{CATEGORIES.find(c => c.id === v.categoryId)?.name || v.categoryId}</span></td>
                    <td className="py-6 text-right pr-4"><button onClick={() => removeVideo(v.id)} className="p-3 text-slate-300 hover:text-red-500 rounded-xl"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div><h2 className="text-3xl font-black text-slate-900 uppercase">Avisos</h2><p className="text-slate-400 text-xs font-bold uppercase mt-1">Informativos da Home</p></div>
            <button onClick={() => { setEditingNoticeId(null); setNoticeForm({ title: '', message: '', type: 'info' }); setShowNoticeModal(true); }} className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all"><Plus size={20} /> Novo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map((n) => (
              <div key={n.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 group hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border ${n.type === 'alert' ? 'bg-red-50 text-red-600 border-red-100' : n.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {n.type === 'alert' ? <AlertTriangle size={20} /> : n.type === 'warning' ? <Bell size={20} /> : <InfoIcon size={20} />}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingNoticeId(n.id); setNoticeForm({ title: n.title, message: n.message, type: n.type }); setShowNoticeModal(true); }} className="p-2.5 bg-white text-slate-300 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm"><Edit2 size={18} /></button>
                    <button onClick={() => removeNotice(n.id)} className="p-2.5 bg-white text-slate-300 hover:text-red-600 rounded-xl border border-slate-100 shadow-sm"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div><h4 className="font-black text-slate-900 uppercase text-sm">{n.title}</h4><p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{n.message}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals are unchanged but kept for completeness */}
      {showAddVideo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase">Nova Rota</h3>
              <button onClick={() => setShowAddVideo(false)} className="text-slate-400 p-2 border rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={addVideo} className="p-8 space-y-6">
              <input required placeholder="Título" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" />
              <select value={newVideo.categoryId} onChange={e => setNewVideo({...newVideo, categoryId: e.target.value as CategoryId})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-black uppercase text-xs">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea required placeholder="Descrição" value={newVideo.description} onChange={e => setNewVideo({...newVideo, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-medium" rows={3} />
              <div className="relative group">
                <input type="file" accept="video/mp4" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className={`w-full px-5 py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center ${videoFile ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                  {videoFile ? <><CheckCircle2 className="text-blue-600 mb-2" size={32} /><span className="text-sm font-black uppercase">{videoFile.name}</span></> : <><FileVideo className="text-slate-300 mb-2" size={32} /><span className="text-xs font-black uppercase">Upload Vídeo (MP4)</span></>}
                </div>
              </div>
              <button type="submit" disabled={isUploading} className="w-full py-5 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl">
                {isUploading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Salvar Trajeto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showNoticeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase">{editingNoticeId ? 'Editar' : 'Novo'} Aviso</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 p-2 border rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={saveNotice} className="p-8 space-y-6">
              <input required placeholder="Título" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" />
              <div className="grid grid-cols-3 gap-3">
                {(['info', 'warning', 'alert'] as const).map(type => (
                  <button key={type} type="button" onClick={() => setNoticeForm({...noticeForm, type})} className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${noticeForm.type === type ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 hover:border-slate-300'}`}>{type}</button>
                ))}
              </div>
              <textarea required placeholder="Mensagem" value={noticeForm.message} onChange={e => setNoticeForm({...noticeForm, message: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-medium" rows={4} />
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;