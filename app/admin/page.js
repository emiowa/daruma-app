

"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      setArticles(data);
    };
    fetchArticles();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex">Manage Articles</h2>
        <Link href="/admin/animation" className="bg-blue-600 text-white px-4 py-2 rounded">
          + onomatopea
        </Link>
        <Link href="/admin/post" className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Article
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} className="border-b">
                <td className="p-4 font-medium">{article.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${article.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    article.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}>
                    {article.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/admin/edit/${article.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}