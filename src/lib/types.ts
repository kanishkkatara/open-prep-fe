// src/lib/types.ts

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

  export interface QuestionSummary {
    id:            string;
    type:          string;
    difficulty:    number;
    tags:          string[];
    parentId?:     string;
    order?:        number;
    preview_text:  string;
    attempted:     boolean;
    correct?:      boolean | null;
    first_subquestion_id?: string | null;
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
  next_question: QuestionResponse | null;
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

export type BlockType =
  | 'paragraph'
  | 'image'
  | 'table'
  | 'list'
  | 'dropdown'
  | 'numeric'
  | 'matrix'
  | 'ds_grid';

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
  /**
   * For ds_grid blocks, these fields appear:
   */
  row_headers?: string[];
  col_headers?: string[];
}

export interface Option {
  id: string;
  blocks: ContentBlock[];
}

export interface CellCoordinate {
  row_index: number;
  column_index: number;
}

export interface AnswerSchema {
  correct_option_id?: string;
  selected_choice_index?: number;
  selected_pairs?: CellCoordinate[];
  clicked_hotspot_id?: string;
}

export interface BaseQuestion {
  id: string;
  type: string;
  content: ContentBlock[];
  options: Option[];
  answers: AnswerSchema;
  tags: string[];
  difficulty: number;
  order?: number | null;
  parent: BaseQuestion | null;
}

export interface SingleQuestion extends BaseQuestion {
  kind: 'single';
  parent: BaseQuestion;
}

export interface CompositeQuestion extends BaseQuestion {
  kind: 'composite';
  groupId: string;
  parent: BaseQuestion | null;
  subquestions: SingleQuestion[];
  totalSubquestions: number;
  nextGroupId: string | null;
}

export type QuestionResponse = SingleQuestion | CompositeQuestion;

/** 🔥 Updated to match backend — now only returns next_question_id */
export interface NextQuestionResponse {
  next_question_id: string | null;
}
