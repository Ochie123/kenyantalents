import { CONFIG } from '@/config-global';
import { PostEditView } from '@/sections/blog/view';


export const metadata = { title: `Post edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;
  return <PostEditView post={id} />;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };

export async function generateStaticParams() {
  return []; // Remove static generation as we'll fetch data dynamically
}