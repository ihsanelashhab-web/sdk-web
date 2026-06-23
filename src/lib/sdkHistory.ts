import { supabase } from "../supabase";

export async function saveSDKHistory(result: {
  title: string;
  version: string;
  endpoints: number;
  files: Record<string, string>;
  languages: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase.from("sdk_history").insert({
    user_id: user.id,
    title: result.title,
    version: result.version,
    endpoints: result.endpoints,
    languages: result.languages,
    files: result.files,
  });

  if (error) {
    throw error;
  }
}

export async function getSDKHistory() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("sdk_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function deleteSDKHistory(id: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("sdk_history")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
}
// حساب hash للملف
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// التحقق من عدد الـ APIs وإضافة جديد
export async function checkAndRegisterProject(file: File): Promise<{
  allowed: boolean;
  reason?: string;
  isNew: boolean;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  
  // غير مسجل → مسموح (بدون تتبع)
  if (!user) return { allowed: true, isNew: false };

  const hash = await hashFile(file);

  // تحقق إذا الـ API موجود مسبقاً
  const { data: existing } = await supabase
    .from('user_projects')
    .select('id')
    .eq('user_id', user.id)
    .eq('api_hash', hash)
    .single();

  if (existing) return { allowed: true, isNew: false };

  // عدد الـ APIs الحالية
  const { count } = await supabase
    .from('user_projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const FREE_LIMIT = 3;

  if ((count ?? 0) >= FREE_LIMIT) {
    return { 
      allowed: false, 
      isNew: true
    };
  }

  // أضف الـ API الجديد
  await supabase.from('user_projects').insert({
    user_id: user.id,
    api_hash: hash,
    title: file.name,
  });

  return { allowed: true, isNew: true };
}