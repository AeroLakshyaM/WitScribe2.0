import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './auth-context';

const adaptUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    uid: user.id,
    displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email,
    photoURL: user.user_metadata?.avatar_url || '',
  };
};

const adaptProfile = (profile) => profile && ({
  ...profile,
  displayName: profile.display_name,
  photoURL: profile.photo_url,
  postalCode: profile.postal_code,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error('Could not restore Supabase session:', error);
      setCurrentUser(adaptUser(data.session?.user));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(adaptUser(session?.user));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      return undefined;
    }

    let active = true;
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      if (error) {
        console.error('Could not load profile:', error);
        return;
      }
      if (active) setUserProfile(adaptProfile(data));
    };
    loadProfile();

    const channel = supabase
      .channel(`profile-${currentUser.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${currentUser.id}`,
      }, loadProfile)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, userProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
