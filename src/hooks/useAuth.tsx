// Path: hooks/useAuth.ts
import { useState, useEffect } from "react";
import { type User, type Session, AuthError, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../integration/supabase/client";

export type Profile = {
  id: string;
  email: string;
  full_name: string;

  role: "hr" | "admin" | "candidate";
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setProfile(null);
        } else {
          setProfile(data as unknown as Profile);
        }
      });
  }, [user]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ error: AuthError | null; profileError: PostgrestError | null }> => {
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: "candidate" },
          emailRedirectTo: window.location.origin + "/login",
        },
      });

    if (signUpError || !signUpData.user) {
      return { error: signUpError, profileError: null };
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      email,
      full_name: fullName,
      role: "candidate",
    });

    return { error: null, profileError: profileError ?? null };
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return {
    user,
    session,
    profile,
    loading: loading || (user !== null && profile === null),
    signUp,
    signIn,
    signOut,
  };
}
