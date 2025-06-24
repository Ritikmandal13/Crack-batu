import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "student" | "admin"
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "student" | "admin"
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "student" | "admin"
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pyqs: {
        Row: {
          id: string
          title: string
          subject: string
          department: string
          semester: string
          year: string
          file_url: string
          view_url: string
          is_premium: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          subject: string
          department: string
          semester: string
          year: string
          file_url: string
          view_url: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          subject?: string
          department?: string
          semester?: string
          year?: string
          file_url?: string
          view_url?: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          pyq_id: string
          action: "viewed" | "downloaded" | "bookmarked"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pyq_id: string
          action: "viewed" | "downloaded" | "bookmarked"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pyq_id?: string
          action?: "viewed" | "downloaded" | "bookmarked"
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          message: string
          type: "feedback" | "request" | "report"
          status: "pending" | "reviewed" | "resolved"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type: "feedback" | "request" | "report"
          status?: "pending" | "reviewed" | "resolved"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: "feedback" | "request" | "report"
          status?: "pending" | "reviewed" | "resolved"
          created_at?: string
        }
      }
    }
  }
}
