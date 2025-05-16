// src/lib/questionCategories.ts

export interface QuestionCategory {
  type: string;
  label: string;
  tags: Array<{ value: string; label: string }>;
}

export const questionCategories: QuestionCategory[] = [
  {
    type: 'problem-solving',
    label: 'Problem Solving',
    tags: [
      { value: 'Word Problems', label: 'Word Problems' },
      { value: 'Arithmetic', label: 'Arithmetic' },
      { value: 'Geometry', label: 'Geometry' },
      { value: 'Algebra', label: 'Algebra' },
      { value: 'Percent and Interest Problems', label: 'Percent and Interest Problems' },
      { value: 'Number Properties', label: 'Number Properties' },
      { value: 'Fractions and Ratios', label: 'Fractions and Ratios' },
      { value: 'Multiples and Factors', label: 'Multiples and Factors' },
      { value: 'Overlapping Sets', label: 'Overlapping Sets' },
      { value: 'Work and Rate Problems', label: 'Work and Rate Problems' },
      { value: 'Exponents', label: 'Exponents' },
      { value: 'Statistics and Sets Problems', label: 'Statistics and Sets Problems' },
      { value: 'Graphs and Illustrations', label: 'Graphs and Illustrations' },
      { value: 'Must or Could be True Questions', label: 'Must or Could be True Questions' },
      { value: 'Distance and Speed Problems', label: 'Distance and Speed Problems' },
      { value: 'Roots', label: 'Roots' },
      { value: 'Min-Max Problems', label: 'Min-Max Problems' },
      { value: 'Remainders', label: 'Remainders' },
      { value: 'Mixture Problems', label: 'Mixture Problems' },
      { value: 'Sequences', label: 'Sequences' },
      { value: 'Inequalities', label: 'Inequalities' }
    ]
  },
  {
    type: 'data-sufficiency',
    label: 'Data Sufficiency',
    tags: [
      { value: 'Word Problems', label: 'Word Problems' },
      { value: 'Number Properties', label: 'Number Properties' },
      { value: 'Algebra', label: 'Algebra' },
      { value: 'Inequalities', label: 'Inequalities' },
      { value: 'Geometry', label: 'Geometry' },
      { value: 'Percent and Interest Problems', label: 'Percent and Interest Problems' },
      { value: 'Multiples and Factors', label: 'Multiples and Factors' },
      { value: 'Distance and Speed Problems', label: 'Distance and Speed Problems' },
      { value: 'Remainders', label: 'Remainders' },
      { value: 'Fractions and Ratios', label: 'Fractions and Ratios' },
      { value: 'Overlapping Sets', label: 'Overlapping Sets' },
      { value: 'Coordinate Geometry', label: 'Coordinate Geometry' },
      { value: 'Arithmetic', label: 'Arithmetic' },
      { value: 'Exponents', label: 'Exponents' },
      { value: 'Work and Rate Problems', label: 'Work and Rate Problems' },
      { value: 'Absolute Values', label: 'Absolute Values' },
      { value: 'Statistics and Sets Problems', label: 'Statistics and Sets Problems' },
      { value: 'Mixture Problems', label: 'Mixture Problems' },
      { value: 'Sequences', label: 'Sequences' },
      { value: 'Probability', label: 'Probability' },
      { value: 'Roots', label: 'Roots' }
    ]
  },
  {
    type: 'critical-reasoning',
    label: 'Critical Reasoning',
    tags: [
      { value: 'Weaken', label: 'Weaken' },
      { value: 'Inference', label: 'Inference' },
      { value: 'Strengthen', label: 'Strengthen' },
      { value: 'Assumption', label: 'Assumption' },
      { value: 'Conclusion', label: 'Conclusion' },
      { value: 'Evaluate Argument', label: 'Evaluate Argument' },
      { value: 'Complete the Passage', label: 'Complete the Passage' },
      { value: 'Must be True', label: 'Must be True' },
      { value: 'Logical Flaw', label: 'Logical Flaw' },
      { value: 'Method of Reasoning', label: 'Method of Reasoning' },
      { value: 'Resolve Paradox', label: 'Resolve Paradox' },
      { value: 'Similar Reasoning', label: 'Similar Reasoning' }
    ]
  },
  {
    type: 'reading-comprehension',
    label: 'Reading Comprehension',
    tags: [
      { value: 'Long Passage', label: 'Long Passage' },
      { value: 'Social Science', label: 'Social Science' },
      { value: 'Short Passage', label: 'Short Passage' },
      { value: 'Science', label: 'Science' },
      { value: 'Humanities', label: 'Humanities' },
      { value: 'Business', label: 'Business' },
      { value: 'Tone', label: 'Tone' }
    ]
  },
  {
    type: 'multi-source-reasoning',
    label: 'Multi Source Reasoning',
    tags: [
      { value: 'Non-Math Related', label: 'Non-Math Related' },
      { value: 'Math Related', label: 'Math Related' }
    ]
  },
  {
    type: 'two-part-analysis',
    label: 'Two-Part Analysis',
    tags: [
      { value: 'Non-Math Related', label: 'Non-Math Related' },
      { value: 'Math Related', label: 'Math Related' }
    ]
  },
  {
    type: 'table-analysis',
    label: 'Table Analysis',
    tags: [
      { value: 'Tables', label: 'Tables' },
      { value: 'Math Related', label: 'Math Related' },
      { value: 'Non-Math Related', label: 'Non-Math Related' }
    ]
  },
  {
    type: 'graphics-interpretation',
    label: 'Graphics Interpretation',
    tags: [
      { value: 'Graphs', label: 'Graphs' },
      { value: 'Math Related', label: 'Math Related' },
      { value: 'Non-Math Related', label: 'Non-Math Related' }
    ]
  }
];
