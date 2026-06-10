import type { User } from './auth';

export type MediaItem = {
  url: string;
  type?: string;
};

export type Testimony = {
  _id: string;
  title: string;
  description: string;
  tags?: string[];
  media?: MediaItem[];
  createdAt: string;
  updatedAt?: string;
  user?: User;
  likesCount?: number;
  repliesCount?: number;
  liked?: boolean;
  isBroadcast?: boolean;
  isSecret?: boolean;
  broadcastOrganizationId?: string;
};

export type Reply = {
  _id: string;
  testimonyId: string;
  content: string;
  createdAt: string;
  user?: User;
  likesCount?: number;
  liked?: boolean;
};

export type TestimonyStats = {
  totalTestimonies: number;
  totalReplies: number;
  totalLikesReceived: number;
  totalViewsReceived: number;
};

export type BroadcastRequest = {
  _id: string;
  testimony?: Testimony;
  status?: string;
  createdAt?: string;
};
