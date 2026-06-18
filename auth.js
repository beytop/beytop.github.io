// BeyTop 共用登入工具（Supabase）
// 之後的報到頁、主辦方頁都 import 這支，共用同一個 Supabase client。
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ===== 待填：你的 Supabase 專案設定（建好專案後給我，我幫你填）=====
const SUPABASE_URL = 'https://ppiqvpauqdqtcnaivqhd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaXF2cGF1cWRxdGNuYWl2cWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjE5NTAsImV4cCI6MjA5NzE5Nzk1MH0.PT4FpmCCE4zp24dM2DAY5rAHnE1uPqmBctrUlHMXjeA';
// anon key 是設計給前端用的公開金鑰，靠資料表的 RLS 規則保護，放在這裡是安全的。
// ================================================================

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 用 Google 登入（登入完成後導回目前頁面）
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href.split('#')[0] },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// 取得目前登入的帳號（未登入回 null）
export async function getSessionUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// 取得目前帳號的 profile（email / display_name / is_organizer）
export async function getProfile() {
  const user = await getSessionUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('email, display_name, is_organizer')
    .eq('id', user.id)
    .single();
  if (error) return null; // 剛註冊時 trigger 可能還沒建好 profile
  return data;
}
