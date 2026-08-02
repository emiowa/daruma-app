import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// グローバル空間（またはブラウザのウィンドウ）に既存の接続がないかチェックする
const globalForSupabase = globalThis;

export const supabase =
  globalForSupabase.supabase || createClient(supabaseUrl, supabaseAnonKey);

// 開発環境でのホットリロード（画面の自動更新）時に、何度もインスタンスが作られるのを防ぐ
if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}