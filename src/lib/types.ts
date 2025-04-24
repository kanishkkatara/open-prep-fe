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
    difficulty: number | string;
    explanation?: string;
  }
  