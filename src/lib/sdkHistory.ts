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
