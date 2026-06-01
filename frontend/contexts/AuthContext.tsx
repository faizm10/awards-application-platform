"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createClient } from '@/supabase/client';
import {
  ensureUserProfile,
  getUserProfile,
  resolveUserRole,
  type UserProfile,
  type UserRole,
} from '@/lib/auth';
import { formatSupabaseError } from '@/lib/supabase-errors';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const syncProfile = useCallback(async (authUser: User) => {
    setProfileLoading(true);
    try {
      await ensureUserProfile(authUser);
      const loaded = await getUserProfile(authUser.id);
      setProfile(loaded);
    } catch (err) {
      console.error('Profile sync failed:', err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const applySession = useCallback(
    (sessionUser: User | null) => {
      setUser(sessionUser);
      setLoading(false);
      if (sessionUser) {
        void syncProfile(sessionUser);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    },
    [syncProfile]
  );

  useEffect(() => {
    let cancelled = false;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('getSession failed:', formatSupabaseError(error));
        }
        if (!cancelled) {
          applySession(session?.user ?? null);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        if (!cancelled) {
          applySession(null);
        }
      }
    };

    void getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!cancelled) {
          applySession(session?.user ?? null);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, applySession]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.user) {
      applySession(data.user);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/awards`,
      },
    });

    if (data?.user) {
      applySession(data.user);
      if (fullName.trim()) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: fullName.trim() })
          .eq("id", data.user.id);

        if (profileError) {
          console.error("Failed to save full name:", formatSupabaseError(profileError));
        }
      }
    }

    return { error, data };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const refreshUser = async () => {
    const { data: { user: refreshed } } = await supabase.auth.getUser();
    applySession(refreshed);
  };

  const userRole = useMemo(
    () => (user ? resolveUserRole(profile, user.email) : null),
    [user, profile]
  );

  const value = {
    user,
    loading,
    profile,
    profileLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
