import { supabase } from '../supabase';

export async function saveSDKHistory(result: {
  title: string;
  version: string;
  endpoints: number;
  files: Record<string, string>;
  languages: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('sdk_history').insert({
    user_id: user.id,
    title: result.title,
    version: result.version,
    endpoints: result.endpoints,
    languages: result.languages,
    files: result.files,
  });
}

export async function getSDKHistory() {
  const { data, error } = await supabase
    .from('sdk_history')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteSDKHistory(id: string) {
  await supabase.from('sdk_history').delete().eq('id', id);
}