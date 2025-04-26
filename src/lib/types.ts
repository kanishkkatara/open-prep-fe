// src/lib/types.ts

export type BlockType =
  | "paragraph"
  | "image"
  | "table"
  | "list"
  | "dropdown"
  | "numeric";

export interface ContentBlock {
  type: BlockType;
  text?: string;
  url?: string;
  alt?: string;
  headers?: string[];
  rows?: string[][];
  data?: {
    items?: string[];
    [key: string]: any;
  };
}

export interface Option {
  id: string;
  blocks: ContentBlock[];
}

export interface Question {
    id: string;
    type: string;
    content: any;
    options: any;
    answers: { correct_option_ids?: string[] };
    tags: string[];
    difficulty: number;
    explanation?: string;
  }

// Raw API item shape
export type RawStudyPlanItem = {
  id: string;
  title: string;
  description: any;
  completed: boolean;
  total: number;
  difficulty: number;
  estimatedTime: number;
  topics: string[];
  icon?: string;
};

// Response from /api/dashboard
export type DashboardData = {
  stats: {
    targetScore: number;
    timeStudied: number;
    questionsCompleted: number;
  };
  studyPlan: RawStudyPlanItem[];
  overallProgress: {
    quantitative: number;
    verbal: number;
    di: number;
    average: number;
  };
};

export interface NextQuestionResponse {
  next_question: Question | null;
}

export interface BasicSettings {
  name: string;
  email: string;
  target_score: number;
  exam_date: string | null;
  previous_score: number | null;
}

export interface NotificationSettings {
  notify_mail: boolean;
  notify_whatsapp: boolean;
}