import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserRole } from '../lib/database.types';

/* ---------------- TYPES ---------------- */

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
}

interface SignUpResult {
  error: AuthError | null;
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
}

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- SESSION BOOTSTRAP ---------- */

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          await handleProfile(session.user);
        } else {
          setProfile(null);
          setLoading(false);
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------- PROFILE HANDLING ---------- */

  const handleProfile = async (user: User) => {
    setLoading(true);

    // Fetch profile
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
      setLoading(false);
      return;
    }

    // Create profile if missing
    if (!existingProfile) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: user.user_metadata.full_name ?? '',
        phone: user.user_metadata.phone ?? null,
        role: 'customer',
      });

      if (insertError) {
        console.error('Profile insert error:', insertError);
        setLoading(false);
        return;
      }
    }

    // Fetch again (guaranteed now)
    const { data: profileData, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!finalError) {
      setProfile(profileData);
    }

    setLoading(false);
  };

  /* ---------- AUTH ACTIONS ---------- */

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone ?? null,
        },
      },
    });

    if (error) {
      return { error };
    }

    // 🔑 EMAIL CONFIRMATION REQUIRED
    if (!data.session) {
      return {
        error: null,
        needsEmailConfirmation: true,
      };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  /* ---------- DERIVED FLAGS ---------- */

  const isAdmin = profile?.role === 'admin';
  const isStaff = profile?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
