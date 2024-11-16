export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          due_date: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'completed'
          user_id: string
          position: number
          category: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          due_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed'
          user_id: string
          position?: number
          category?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          due_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed'
          user_id?: string
          position?: number
          category?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
          color: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          user_id: string
          color: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          user_id?: string
          color?: string
        }
      }
    }
  }
}