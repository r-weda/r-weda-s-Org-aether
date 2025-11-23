export enum View {
  DASHBOARD = 'DASHBOARD',
  AI_CHAT = 'AI_CHAT',
  IMAGINE = 'IMAGINE',
  COLLAB = 'COLLAB',
  PRODUCT_3D = 'PRODUCT_3D',
  NEURAL = 'NEURAL'
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ProductConfig {
  color: string;
  metalness: number;
  roughness: number;
  autoRotate: boolean;
}

export enum AiPersonality {
  JARVIS = 'JARVIS (Professional)',
  HAL = 'HAL (Analytical)',
  GLADOS = 'GLaDOS (Sarcastic)',
  YODA = 'YODA (Wise)'
}
