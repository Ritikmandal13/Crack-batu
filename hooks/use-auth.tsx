"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name: string
  role: "student" | "admin"
  isPremium: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).maybeSingle()

      if (error) {
        console.error("Error fetching user profile:", error)
        setLoading(false)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          isPremium: data.is_premium,
        })
      } else {
        // Try to insert, but handle duplicate key error gracefully
        const { error: insertError } = await supabase.from("users").insert({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || "",
          role: "student",
          is_premium: false,
        })

        if (insertError) {
          if (insertError.code === "23505") {
            // Duplicate key, fetch the row again
            const { data: retryData } = await supabase.from("users").select("*").eq("id", supabaseUser.id).maybeSingle()
            if (retryData) {
              setUser({
                id: retryData.id,
                email: retryData.email,
                name: retryData.name,
                role: retryData.role,
                isPremium: retryData.is_premium,
              })
            }
          } else {
            console.error("Error creating user profile:", insertError)
          }
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    console.log("login() called with", { email });
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("login() full result", result);
    if (result.error) {
      throw new Error(result.error.message);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        // Step 2: Wait a moment for the auth session to be established
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Step 3: Create user profile with retry logic
        let retries = 3
        while (retries > 0) {
          try {
            const { error: profileError } = await supabase.from("users").insert({
              id: data.user.id,
              email,
              name,
              role: "student",
              is_premium: false,
            })

            if (!profileError) {
              break // Success, exit retry loop
            }

            if (profileError.message.includes("row-level security")) {
              retries--
              if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                continue
              }
            }

            throw profileError
          } catch (retryError) {
            if (retries === 1) {
              throw retryError
            }
            retries--
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
    setUser(null)
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
