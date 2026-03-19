import type { User } from './auth';

export type Message = {
  _id: string;
  from?: User;
  to?: User;
  text: string;
  createdAt: string;
  read?: boolean;
};

export type ConversationPreview = {
  user: User;
  lastMessage?: Message;
  unreadCount?: number;
};
