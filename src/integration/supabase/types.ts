export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      candidate_responses: {
        Row: {
          adherence_percentage: number;
          candidate_email: string;
          candidate_name: string;
          completed_at: string;
          id: string;
          max_possible_score: number;
          questionnaire_id: string;
          responses: Json;
          total_score: number;
          status: string; 
          candidate_id: string;  
        };
        Insert: {
          adherence_percentage?: number;
          candidate_email: string;
          candidate_name: string;
          candidate_id: string;   
          completed_at?: string;
          id?: string;
          max_possible_score?: number;
          questionnaire_id: string;
          responses: Json;
          total_score?: number;
          status?: string;
        };
        Update: {
          adherence_percentage?: number;
          candidate_email?: string;
          candidate_name?: string;
          completed_at?: string;
          id?: string;
          max_possible_score?: number;
          questionnaire_id?: string;
          responses?: Json;
          total_score?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'candidate_responses_candidate_id_fkey';
            columns: ['candidate_id'];
            referencedRelation: 'auth.users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'candidate_responses_questionnaire_id_fkey';
            columns: ['questionnaire_id'];
            referencedRelation: 'questionnaires';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      questionnaires: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          job_type: string;
          name: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          job_type: string;
          name: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          job_type?: string;
          name?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          created_at: string;
          id: string;
          options: Json | null;
          order_index: number;
          question_text: string;
          question_type: string;
          questionnaire_id: string;
          updated_at: string;
          weight: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          options?: Json | null;
          order_index?: number;
          question_text: string;
          question_type?: string;
          questionnaire_id: string;
          updated_at?: string;
          weight?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          options?: Json | null;
          order_index?: number;
          question_text?: string;
          question_type?: string;
          questionnaire_id?: string;
          updated_at?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "questions_questionnaire_id_fkey";
            columns: ["questionnaire_id"];
            isOneToOne: false;
            referencedRelation: "questionnaires";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<
  T extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T]["Row"];

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T]["Insert"];

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T]["Update"];

export type Enums<
  E extends keyof DefaultSchema["Enums"]
> = DefaultSchema["Enums"][E];

export type CompositeTypes<
  C extends keyof DefaultSchema["CompositeTypes"]
> = DefaultSchema["CompositeTypes"][C];

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
