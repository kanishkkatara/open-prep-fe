// src/lib/questionCategories.ts

/**
 * Defines GMAT question types and their associated tags.
 * Reference: GMAT Club Topics (e.g., Problem Solving, Data Sufficiency, Verbal)
 */
export interface QuestionCategory {
    /** internal type value */
    type: string;
    /** human-friendly label */
    label: string;
    /** list of tag values and labels for this type */
    tags: Array<{ value: string; label: string }>;
  }
  
  export const questionCategories: QuestionCategory[] = [
    {
      type: 'problem-solving',
      label: 'Problem Solving',
      tags: [
        { value: 'algebra', label: 'Algebra' },
        { value: 'arithmetic', label: 'Arithmetic' },
        { value: 'geometry', label: 'Geometry' },
        { value: 'word-problems', label: 'Word Problems' },
        { value: 'time-distance', label: 'Time & Distance' },
        { value: 'probability-combinatorics', label: 'Probability & Combinatorics' },
        { value: 'statistics', label: 'Statistics' },
        { value: 'data-interpretation', label: 'Data Interpretation' }
      ]
    },
    {
      type: 'data-sufficiency',
      label: 'Data Sufficiency',
      tags: [
        { value: 'algebra', label: 'Algebra' },
        { value: 'arithmetic', label: 'Arithmetic' },
        { value: 'geometry', label: 'Geometry' },
        { value: 'number-properties', label: 'Number Properties' },
        { value: 'ratios-proportions', label: 'Ratios & Proportions' },
        { value: 'statistics', label: 'Statistics' },
        { value: 'combinatorics-probability', label: 'Combinatorics & Probability' },
        { value: 'data-interpretation', label: 'Data Interpretation' }
      ]
    },
    {
      type: 'critical-reasoning',
      label: 'Critical Reasoning',
      tags: [
        { value: 'assumption', label: 'Assumption' },
        { value: 'strengthen', label: 'Strengthen' },
        { value: 'weaken', label: 'Weaken' },
        { value: 'inference', label: 'Inference' },
        { value: 'conclusion', label: 'Conclusion' },
        { value: 'boldface', label: 'Boldface' },
        { value: 'evaluation', label: 'Evaluation' }
      ]
    },
    {
      type: 'reading-comprehension',
      label: 'Reading Comprehension',
      tags: [
        { value: 'main-idea', label: 'Main Idea' },
        { value: 'detail', label: 'Detail' },
        { value: 'inference', label: 'Inference' },
        { value: 'tone-style', label: 'Tone & Style' },
        { value: 'author-purpose', label: 'Author’s Purpose' },
        { value: 'logical-structure', label: 'Logical Structure' },
        { value: 'comparative-passages', label: 'Comparative Passages' }
      ]
    },
    {
      type: 'multi-source-reasoning',
      label: 'Multi Source Reasoning',
      tags: [
        { value: 'math-related', label: 'Math Related' },
        { value: 'non-math-related', label: 'Non-Math Related' },
      ]
    },
    {
      type: 'two-part-analysis',
      label: 'Two-Part Analysis',
      tags: [
        { value: 'math-related', label: 'Math Related' },
        { value: 'non-math-related', label: 'Non-Math Related' },
      ]
    },
    {
      type: 'table-analysis',
      label: 'Table Analysis',
      tags: [
        { value: 'math-related', label: 'Math Related' },
        { value: 'non-math-related', label: 'Non-Math Related' },
      ]
    },
    {
      type: 'graphics-interpretation',
      label: 'Graphics Interpretation',
      tags: [
        { value: 'math-related', label: 'Math Related' },
        { value: 'non-math-related', label: 'Non-Math Related' },
      ]
    }
  ];
  