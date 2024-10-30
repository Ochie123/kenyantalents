import { paramCase } from '@/utils/change-case';

import { _id, _postTitles } from '@/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {

  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',

  post: {
    root: `/post`,
    details: (id: string) => `/post/${paramCase(id)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
  
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/post/${paramCase(id)}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/post/${paramCase(id)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },

  },
};
