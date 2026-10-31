import { supabase } from '../lib/supabase';

export const getProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return {
    displayName: data.display_name || '',
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    postalCode: data.postal_code || '',
    photoURL: data.photo_url || '',
  };
};

export const updateProfile = async (userId, profile) => {
  const { error } = await supabase.from('profiles').update({
    display_name: profile.displayName,
    phone: profile.phone,
    location: profile.location,
    postal_code: profile.postalCode,
    photo_url: profile.photoURL,
    updated_at: new Date().toISOString(),
  }).eq('id', userId);
  if (error) throw error;
};

export const uploadAvatar = async (userId, file) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  await updateProfile(userId, { photoURL: data.publicUrl });
  return data.publicUrl;
};
