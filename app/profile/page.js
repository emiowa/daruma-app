"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';
import { FaCamera } from 'react-icons/fa6'; // ⭕️ アイコン変更用のカメラマーク

export default function ProfilePage() {
  const { user, authLoading } = useAuth();

  // ⭕️ 追加：ユーザーのアイコンURLを管理するステート
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ユーザー情報が確定したら、メタデータからアバターURLを取得
  useEffect(() => {
    if (user) {
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user]);

  // ⭕️ 追加：画像を選択したときのアップロード処理
  const handleUploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Supabase Storage（'avatars'バケット）に画像をアップロード
      // ※事前にSupabase側で「avatars」という名前のPublicバケットを作成しておく必要があります
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. アップロードした画像の公開URLを取得
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. ユーザーのメタデータ（avatar_url）を更新
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      alert("¡Avatar actualizado con éxito!");

    } catch (error) {
      alert(error.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleClickLogout = async () => {
    const ok = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (ok) {
      await supabase.auth.signOut();
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full max-w-[1000px] mx-auto">
        <div className="animate-spin h-8 w-8 border-4 border-main-grey border-t-transparent rounded-full mb-4"></div>
        <p className="text-main-grey italic">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 mt-10 pb-20">

      <div className="text-main-grey font-bold text-4xl md:text-5xl mb-10 pl-2">
        👤 Mi Perfil
      </div>

      <div className="bg-main-lightBlue w-full p-6 md:p-10 shadow-large rounded-2xl border border-black relative">

        {user ? (
          <div className="flex flex-col gap-6 w-full max-w-[600px] bg-main-white border border-black rounded-2xl p-6 md:p-8 mx-auto shadow-small">

            {/* ⭕️ 修正：インタラクティブなアイコン選択エリア */}
            <div className="flex flex-col items-center border-b border-gray-200 pb-6 mb-2">

              <label className="relative w-24 h-24 rounded-full border border-black flex items-center justify-center overflow-hidden bg-main-background shadow-small cursor-pointer group mb-3 transition-transform hover:scale-105">
                {/* 隠しインプット（画像ファイル用） */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadAvatar}
                  disabled={uploading}
                />

                {avatarUrl ? (
                  /* ユーザーが設定したアイコンがある場合 */
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  /* 💡 していないうちは「薄めのだるまアイコン」を表示 */
                  <img
                    src="/images/daruma_logo_transparent.png"
                    alt="Default Daruma"
                    className="w-16 h-16 object-contain opacity-30 group-hover:opacity-40 transition-opacity duration-200"
                  />
                )}

                {/* ホバーした時に重なる「カメラマーク（変更するよ）」のレイヤー */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
                  <FaCamera size={18} />
                  <span className="text-[10px] font-bold mt-1">Cambiar</span>
                </div>

                {/* アップロード中のローディング重ね表示 */}
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-main-grey border-t-transparent rounded-full"></div>
                  </div>
                )}
              </label>

              <h2 className="text-2xl font-bold text-main-grey">{user.user_metadata?.name || "Estudiante"}</h2>
              <p className="text-xs text-gray-400 mt-1">ID: {user.id?.substring(0, 8)}...</p>
            </div>

            {/* ログイン情報一覧 */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre de usuario</span>
                <span className="text-base text-main-grey font-semibold">{user.user_metadata?.name || "No registrado"}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Correo electrónico</span>
                <span className="text-base text-main-grey font-semibold font-sans">{user.email}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Último acceso</span>
                <span className="text-sm text-gray-600 font-sans">
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "---"}
                </span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                href="/study"
                className="flex-1 py-3 bg-main-yellow text-white text-center border border-black rounded-full font-bold shadow-small hover-float active:scale-[0.98] transition-all text-sm"
              >
                Ir a estudiar
              </Link>
              <button
                onClick={handleClickLogout}
                className="flex-1 py-3 bg-red-500 text-white border border-black rounded-full font-bold shadow-small hover:bg-red-600 active:scale-[0.98] transition-all text-sm cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>

          </div>
        ) : (
          <div className="flex flex-col text-center items-center justify-center w-full max-w-[600px] rounded-2xl shadow-small bg-main-white py-12 px-8 border border-black mx-auto">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-main-grey mb-3">No has iniciado sesión</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-[360px]">
              Inicia sesión con tu cuenta para ver tus datos personales y seguir guardando palabras in tu lista.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[340px]">
              <Link
                href="/auth/login"
                className="flex-1 py-3 bg-main-yellow text-white text-center border border-black rounded-full font-bold shadow-small hover-float active:scale-[0.98] transition-all text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/home"
                className="flex-1 py-3 bg-main-white text-main-grey text-center border border-black rounded-full font-bold shadow-small hover:bg-gray-50 active:scale-[0.98] transition-all text-sm"
              >
                Volver
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}