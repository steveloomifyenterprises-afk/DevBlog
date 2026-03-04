import { redirect } from 'next/navigation';

export default function AboutPage() {
  // Redirect to profile - profile page handles auth check
  redirect('/profile');
}
