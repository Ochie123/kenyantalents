import { paths } from '@/routes/paths';

import { CONFIG } from '@/config-global';

import { Label } from '@/components/label';
import { Iconify } from '@/components/iconify';
import { SvgColor } from '@/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {

  blog: icon('ic-blog'),
  dashboard: icon('ic-dashboard'),
  calendar: icon('ic-calendar'),

};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'App', path: paths.dashboard.root, icon: ICONS.dashboard },

    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Blog',
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        children: [
          { title: 'List', path: paths.dashboard.post.root },
          { title: 'Create', path: paths.dashboard.post.new },
        ],

      },
      { title: 'Calendar', path: paths.dashboard.calendar, icon: ICONS.calendar },
 

    ],
  },
  /**
   * Item State
   */

];
