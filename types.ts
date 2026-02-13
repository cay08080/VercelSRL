
export type CategoryId = 'inicio' | 'perfil' | 'fio-maquina' | 'chapas-grossas' | 'ferrovia' | 'placa-bloco-tarugo';

export interface VideoRoute {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  categoryId: CategoryId;
  duration: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  createdAt: string;
}

export interface Voucher {
  code: string;
  expiresAt: number; // timestamp
}

export interface AccessSession {
  isActive: boolean;
  expiresAt?: number;
}
