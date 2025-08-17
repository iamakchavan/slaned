import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile from Supabase
  const fetchProfile = async () => {
    if (!user || !supabase) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, this is okay for new users
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Get display name with fallback
  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
    getDisplayName,
  };
};