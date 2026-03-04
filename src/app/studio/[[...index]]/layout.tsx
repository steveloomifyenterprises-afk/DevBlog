import { NextStudio } from 'next-sanity/studio';
import { config } from '@/sanity/config';

export default function StudioLayout() {
  return <NextStudio config={config} />;
}
