
import React from 'react';
import { 
  Home,
  Cpu, 
  Layers, 
  Train, 
  Box
} from 'lucide-react';
import { CategoryId } from './types';

// Ícone Customizado de Viga H (Perfil Estrutural)
const HBeamIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v18M18 3v18M6 12h12" />
  </svg>
);

export const CATEGORIES = [
  { id: 'inicio' as CategoryId, name: 'Início', icon: <Home size={20} /> },
  { id: 'perfil' as CategoryId, name: 'Perfil', icon: <HBeamIcon size={20} /> },
  { id: 'fio-maquina' as CategoryId, name: 'Fio Máquina', icon: <Cpu size={20} /> },
  { id: 'chapas-grossas' as CategoryId, name: 'Chapas Grossas', icon: <Layers size={20} /> },
  { id: 'ferrovia' as CategoryId, name: 'Ferrovia', icon: <Train size={20} /> },
  { id: 'placa-bloco-tarugo' as CategoryId, name: 'Placa-Bloco-Tarugo', icon: <Box size={20} /> },
];

// Vídeo estável de alta performance (Visão da cabine no asfalto)
const TRUCK_CABIN_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-highway-at-high-speed-4235-large.mp4";

export const MOCK_VIDEOS = [
  {
    id: 'welcome-driving',
    title: 'Orientações Gerais de Tráfego',
    description: 'Visão da cabine: Procedimentos de entrada e saída do terminal logístico.',
    videoUrl: TRUCK_CABIN_VIDEO,
    thumbnail: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
    categoryId: 'inicio',
    duration: '3:20',
    updatedAt: '01/01/2025'
  },
  {
    id: 'perfil-area-1',
    title: 'Trajeto: Área de Perfis (Carregamento)',
    description: 'Rota interna para o galpão de perfis estruturais.',
    videoUrl: TRUCK_CABIN_VIDEO,
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    categoryId: 'perfil',
    duration: '5:10',
    updatedAt: '05/01/2025'
  },
  {
    id: 'fio-maquina-1',
    title: 'Rota: Setor Fio Máquina',
    description: 'Acesso prioritário para descarga de bobinas de fio máquina.',
    videoUrl: TRUCK_CABIN_VIDEO,
    thumbnail: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    categoryId: 'fio-maquina',
    duration: '4:15',
    updatedAt: '12/05/2024'
  },
  {
    id: 'chapas-1',
    title: 'Logística de Chapas Grossas',
    description: 'Percurso obrigatório para o pátio de chapas (Setor Sul).',
    videoUrl: TRUCK_CABIN_VIDEO,
    thumbnail: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&q=80&w=800',
    categoryId: 'chapas-grossas',
    duration: '6:30',
    updatedAt: '18/05/2024'
  },
  {
    id: 'ferrovia-1',
    title: 'Travessia Ferroviária Interna',
    description: 'Visão do trajeto sobre trilhos e sinalização ferroviária.',
    videoUrl: TRUCK_CABIN_VIDEO,
    thumbnail: 'https://images.unsplash.com/photo-1474487056235-0d67385a828a?auto=format&fit=crop&q=80&w=800',
    categoryId: 'ferrovia',
    duration: '2:50',
    updatedAt: '15/05/2024'
  },
  {
    id: 'pbt-1',
    title: 'Transporte: Placa, Bloco e Tarugo',
    description: 'Acesso aos fornos e áreas de resfriamento PBT.',
    videoUrl: TRUCK_CABIN_VIDEO,
    thumbnail: 'https://images.unsplash.com/photo-1533932252533-333e602264c7?auto=format&fit=crop&q=80&w=800',
    categoryId: 'placa-bloco-tarugo',
    duration: '8:20',
    updatedAt: '20/05/2024'
  }
];
