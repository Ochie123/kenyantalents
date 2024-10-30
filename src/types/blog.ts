import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IPostFilters = {
  publish: string;
};

export type IPostHero = {
  title: string;
  coverUrl: string;
  createdAt?: IDateValue;
  author?: { name: string; avatarUrl: string };
};

export type IPostComment = {
  id: string;
  name: string;
  avatarUrl: string;
  message: string;
  postedAt: IDateValue;
  users: { id: string; name: string; avatarUrl: string }[];
  replyComment: {
    id: string;
    userId: string;
    message: string;
    tagUser?: string;
    postedAt: IDateValue;
  }[];
};

export interface IPostItem {
  coverUrl: string | undefined;
  id: number;
  user: string;
  category: string;
  tags: {
    id: number;
    title: string;
  }[];
  title: string;
  slug: string;
  cover_image: string;
  description: string;
  is_active: boolean;
  toprated: boolean;
  bestseller: boolean;
  publish: string;
  status: 'PB' | 'DR';  // PB = Published, DR = Draft
}