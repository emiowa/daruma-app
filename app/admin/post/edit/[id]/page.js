"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login'); // 未ログインならログインへ
        return;
      }

      // profilesテーブルからroleを取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'writer' && profile.role !== 'translator')) {
        router.push('/'); // 権限がなければトップへ
        return;
      }

      setAuthorized(true);
    };
    checkRole();
  }, []);

  if (!authorized) return <div className="p-10 text-center">Checking authority...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* サイドバーなどをここに置くと管理画面っぽくなります */}
      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-blue-600">Dashboard</a>
          <a href="/admin/post" className="block hover:text-blue-600">New Post</a>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}