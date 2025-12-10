import React, { ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  promptPrefix: string;
}