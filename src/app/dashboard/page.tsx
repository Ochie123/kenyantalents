import { CONFIG } from '@/config-global';

//import { OverviewAppView } from '@/sections/overview/appadmin/view';
import { PostListView } from '@/sections/blog/view';
// ----------------------------------------------------------------------
export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <PostListView  />;
}