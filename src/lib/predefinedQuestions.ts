// src/data/predefinedQuestions.ts

export type QuestionCategory =
  | 'generic'
  | 'problem-solving'
  | 'reading-comprehension'
  | 'critical-reasoning'
  | 'data-sufficiency'
  | 'table-analysis'
  | 'graphics-interpretation'
  | 'two-part-analysis'
  | 'multi-source-reasoning'

export interface QuestionTagSet {
  tag: string
  questions: string[]
}

interface QuestionSet {
  type: QuestionCategory
  tags: QuestionTagSet[]
}

export const predefinedQuestions: QuestionSet[] = [
  {
    type: 'generic',
    tags: [
      {
        tag: 'General',
        questions: [
          'How should I approach this type of question?',
          'What key concepts do I need to understand for this question?',
          'What are common traps or mistakes to avoid here?',
          'How can I improve my speed on this type of question?',
          'What strategies would help me eliminate wrong answers?',
          'Can you explain the solution step-by-step?',
          'How do I know if my answer is correct?',
          'What should I do when I\'m stuck on this type of question?',
          'What formulas or rules are most relevant here?',
          'How can I better manage my time with this question type?',
          'What should I focus on when reading this question?',
          'How can I check my work efficiently?',
          'What\'s the best way to prepare for this question type?'
        ],
      },
    ],
  },

  {
    type: 'critical-reasoning',
    tags: [
      {
        tag: 'Weaken',
        questions: [
          'How do I identify the conclusion in a weaken question?',
          'What types of evidence most effectively weaken arguments?',
          'How do I differentiate between weakening and destroying an argument?',
          'What are the common trap answers in weaken questions?',
          'How do I spot assumptions that can be targeted to weaken the argument?'
        ],
      },
      {
        tag: 'Inference',
        questions: [
          'How do I identify what must be true from the passage?',
          'What\'s the difference between a valid inference and a likely one?',
          'How do I avoid going beyond the scope of the passage?',
          'What are common wrong answer types in inference questions?',
          'How do I test if an inference is properly supported?'
        ],
      },
      {
        tag: 'Strengthen',
        questions: [
          'What makes an answer choice effectively strengthen an argument?',
          'How do I identify the key assumption to strengthen?',
          'What\'s the difference between necessary and sufficient strengtheners?',
          'How do I avoid answer choices that seem to strengthen but don\'t?',
          'What types of evidence best support different argument structures?'
        ],
      },
      {
        tag: 'Assumption',
        questions: [
          'How do I identify unstated assumptions in arguments?',
          'What\'s the difference between necessary and sufficient assumptions?',
          'How do I use the negation test for assumption questions?',
          'What are common types of assumptions in GMAT arguments?',
          'How do assumptions relate to gaps in reasoning?'
        ],
      },
      {
        tag: 'Conclusion',
        questions: [
          'How do I identify the main conclusion in complex arguments?',
          'What\'s the difference between intermediate and final conclusions?',
          'How do I differentiate between conclusions and evidence?',
          'What are common wrong answer traps in conclusion questions?',
          'How do I select a conclusion that follows logically from premises?'
        ],
      },
      {
        tag: 'Evaluate Argument',
        questions: [
          'What criteria should I use to evaluate argument strength?',
          'How do I identify what information would help evaluate an argument?',
          'What makes an answer relevant for evaluating an argument?',
          'How do I distinguish between evaluating and strengthening/weakening?',
          'What questions should I ask when assessing argument quality?'
        ],
      },
      {
        tag: 'Complete the Passage',
        questions: [
          'How do I predict what completes the argument logically?',
          'What makes an appropriate conclusion for the given premises?',
          'How do I identify the author\'s reasoning pattern to complete it?',
          'What are common wrong answer types in complete-the-passage questions?',
          'How do I ensure the completion maintains the author\'s tone and intent?'
        ],
      },
      {
        tag: 'Must be True',
        questions: [
          'How do I distinguish between what must be true and what could be true?',
          'What\'s the difference between inference and must-be-true questions?',
          'How do I avoid answers that go beyond the given information?',
          'What are common wrong answer patterns in must-be-true questions?',
          'How do I test if something truly must follow from the premises?'
        ],
      },
      {
        tag: 'Logical Flaw',
        questions: [
          'What are the common logical fallacies in GMAT arguments?',
          'How do I identify circular reasoning in arguments?',
          'What\'s the difference between correlation/causation flaws?',
          'How do I recognize faulty comparisons or analogies?',
          'What are typical flaws in statistical reasoning?'
        ],
      },
      {
        tag: 'Method of Reasoning',
        questions: [
          'How do I identify the structure of an argument?',
          'What are common reasoning methods in GMAT arguments?',
          'How do I recognize inductive vs. deductive reasoning?',
          'What are examples of reasoning by analogy or counterexample?',
          'How do I match reasoning patterns between different arguments?'
        ],
      },
      {
        tag: 'Resolve Paradox',
        questions: [
          'How do I identify the core paradox or discrepancy?',
          'What makes an effective resolution to a paradox?',
          'How do I evaluate competing explanations for discrepancies?',
          'What are common wrong answer types in paradox questions?',
          'How do I distinguish between resolving and explaining away a paradox?'
        ],
      },
      {
        tag: 'Similar Reasoning',
        questions: [
          'How do I identify the core reasoning structure in arguments?',
          'What\'s the difference between similar content and similar reasoning?',
          'How do I abstract the logical form from specific content?',
          'What are common reasoning patterns I should recognize?',
          'How do I avoid being misled by vocabulary similarities?'
        ],
      },
    ],
  },
  {
    type: 'data-sufficiency',
    tags: [
      {
        tag: 'Word Problems',
        questions: [
          'How do I translate word problems into equations?',
          'What information should I look for in each statement?',
          'How do I test if a statement is sufficient?',
          'What are common traps in data sufficiency word problems?',
          'How do I combine information from both statements efficiently?'
        ],
      },
      {
        tag: 'Number Properties',
        questions: [
          'What key number properties should I check in data sufficiency?',
          'How do I test odd/even properties with variables?',
          'What approaches work for testing divisibility or factor questions?',
          'How do I determine if I can find a unique value from the constraints?',
          'What common number property combinations appear in statements?'
        ],
      },
      {
        tag: 'Algebra',
        questions: [
          'How do I know if I have enough equations to solve for variables?',
          'What algebraic manipulations are most useful in data sufficiency?',
          'How do I recognize when a system has unique or multiple solutions?',
          'What are common algebraic constraints in GMAT questions?',
          'How do I efficiently combine algebraic information from statements?'
        ],
      },
      {
        tag: 'Inequalities',
        questions: [
          'How do I test sufficiency with inequalities?',
          'What techniques help determine ranges or bounds?',
          'How do I recognize when a statement narrows down to a unique value?',
          'What are common mistakes when combining inequality statements?',
          'How do I handle inequalities with variables on both sides?'
        ],
      },
      {
        tag: 'Geometry',
        questions: [
          'What geometric properties are crucial for data sufficiency?',
          'How do I determine if I have enough information to find a unique value?',
          'What are common geometry information combinations in statements?',
          'How do I identify when statements provide redundant geometric information?',
          'What properties of triangles, circles, or polygons are most relevant?'
        ],
      },
      {
        tag: 'Percent and Interest Problems',
        questions: [
          'How do I test sufficiency in percent change questions?',
          'What information is typically needed to solve interest problems?',
          'How do I recognize when statements provide redundant percentage information?',
          'What formulas are most useful for percent and interest data sufficiency?',
          'How do I handle consecutive percent changes in statements?'
        ],
      },
      {
        tag: 'Multiples and Factors',
        questions: [
          'How do I test if statements provide enough factor information?',
          'What approaches help determine if factors or multiples are unique?',
          'How do I combine factor information from multiple statements?',
          'What are common traps in factor/multiple data sufficiency questions?',
          'How do I test for remainders or divisibility efficiently?'
        ],
      },
      {
        tag: 'Distance and Speed Problems',
        questions: [
          'What information is necessary to solve distance-rate-time problems?',
          'How do I test if speed or distance is uniquely determined?',
          'What are common formulas for data sufficiency in motion problems?',
          'How do I handle relative motion or direction information?',
          'What are typical combinations of distance-rate statements?'
        ],
      },
      {
        tag: 'Remainders',
        questions: [
          'How do I test if statements determine a unique remainder?',
          'What properties of remainders are most useful in data sufficiency?',
          'How do I combine remainder information from multiple statements?',
          'What are common patterns in remainder questions?',
          'How do I handle remainders with variables or unknown numbers?'
        ],
      },
      {
        tag: 'Fractions and Ratios',
        questions: [
          'How do I test if ratios are uniquely determined by statements?',
          'What information is necessary to find fraction values?',
          'How do I combine ratio information effectively?',
          'What are common traps in fraction data sufficiency questions?',
          'How do I handle part-to-whole relationships in statements?'
        ],
      },
      {
        tag: 'Overlapping Sets',
        questions: [
          'What information is necessary to determine set sizes or overlaps?',
          'How do I test if set information is sufficient?',
          'What diagrams help organize overlapping set data?',
          'How do I combine information about multiple sets?',
          'What equations or formulas work best for overlapping sets?'
        ],
      },
      {
        tag: 'Coordinate Geometry',
        questions: [
          'What determines if I can find unique coordinates or distances?',
          'How do I combine coordinate information from statements?',
          'What formulas are essential for coordinate geometry sufficiency?',
          'How do I handle questions about slopes or equations of lines?',
          'What are common coordinate geometry constraints in statements?'
        ],
      },
      {
        tag: 'Arithmetic',
        questions: [
          'How do I test if arithmetic information is sufficient?',
          'What arithmetic properties are most relevant to data sufficiency?',
          'How do I recognize when statements provide redundant information?',
          'What are efficient testing strategies for arithmetic statements?',
          'How do I combine arithmetic constraints from both statements?'
        ],
      },
      {
        tag: 'Exponents',
        questions: [
          'What properties of exponents are crucial for data sufficiency?',
          'How do I test if exponent information is sufficient?',
          'What are common exponent relationships in GMAT questions?',
          'How do I handle unknown bases or powers in statements?',
          'What techniques help with exponential equations in data sufficiency?'
        ],
      },
      {
        tag: 'Work and Rate Problems',
        questions: [
          'What information is necessary to solve work-rate problems?',
          'How do I test if work rates are uniquely determined?',
          'What are the best formulas for work-rate data sufficiency questions?',
          'How do I handle combined work rates in statements?',
          'What are common work-rate constraints in GMAT questions?'
        ],
      },
      {
        tag: 'Absolute Values',
        questions: [
          'How do I test sufficiency with absolute value expressions?',
          'What cases should I consider for absolute value equations?',
          'How do I handle absolute value inequalities in statements?',
          'What techniques help determine if absolute values have unique solutions?',
          'What are common absolute value properties in data sufficiency?'
        ],
      },
      {
        tag: 'Statistics and Sets Problems',
        questions: [
          'What statistical information is typically needed for sufficiency?',
          'How do I test if I can determine means, medians, or ranges?',
          'What approaches work for standard deviation or variance questions?',
          'How do I combine statistical information from statements?',
          'What are common statistical constraints in GMAT questions?'
        ],
      },
      {
        tag: 'Mixture Problems',
        questions: [
          'What information is necessary to solve mixture problems?',
          'How do I test if concentrations or quantities are uniquely determined?',
          'What formulas are most useful for mixture data sufficiency?',
          'How do I handle multiple mixtures in statements?',
          'What are common mixture constraints in GMAT questions?'
        ],
      },
      {
        tag: 'Sequences',
        questions: [
          'What determines if I have enough information about sequences?',
          'How do I test if terms or patterns are uniquely determined?',
          'What approaches work for arithmetic or geometric sequences?',
          'How do I handle recursive or complex sequence definitions?',
          'What are common sequence constraints in data sufficiency?'
        ],
      },
      {
        tag: 'Probability',
        questions: [
          'What information is needed to determine unique probabilities?',
          'How do I test if probability statements are sufficient?',
          'What formulas or approaches work best for probability sufficiency?',
          'How do I handle dependent or independent events in statements?',
          'What are common probability constraints in GMAT questions?'
        ],
      },
      {
        tag: 'Roots',
        questions: [
          'How do I test if information about roots is sufficient?',
          'What properties of roots are most relevant to data sufficiency?',
          'How do I handle square root equations in statements?',
          'What approaches work for higher-order roots?',
          'What are common root constraints in GMAT questions?'
        ],
      },
    ],
  },
  {
    type: 'graphics-interpretation',
    tags: [
      {
        tag: 'Graphs',
        questions: [
          'What are the key features I should identify in this graph?',
          'How do I interpret the relationship between variables?',
          'What calculations can I perform using the graph information?',
          'How do I identify trends or patterns in the data?',
          'What are common misinterpretations to avoid with this graph?'
        ],
      },
      {
        tag: 'Math Related',
        questions: [
          'How do I calculate slopes or rates of change from this graph?',
          'What formulas should I apply to interpret this mathematical graph?',
          'How do I extract exact values versus estimates from the graph?',
          'What mathematical relationships are represented visually?',
          'How do I solve for unknowns using the graphical information?'
        ],
      },
      {
        tag: 'Non-Math Related',
        questions: [
          'How do I extract qualitative insights from this graph?',
          'What does this visualization tell me about relationships or patterns?',
          'How do I interpret this graph in the context of the scenario?',
          'What are the implications of the trends shown?',
          'How do I distinguish between correlation and causation in this graph?'
        ],
      },
    ],
  },
  {
    type: 'multi-source-reasoning',
    tags: [
      {
        tag: 'Math Related',
        questions: [
          'How do I synthesize numerical information from multiple sources?',
          'What strategies help track contradictory quantitative information?',
          'How do I determine which source provides the most relevant numerical data?',
          'What calculations require combining data from different sources?',
          'How do I resolve inconsistencies in mathematical information?'
        ],
      },
      {
        tag: 'Non-Math Related',
        questions: [
          'How do I identify and resolve contradictions between sources?',
          'What strategies help compare perspectives across different texts?',
          'How do I determine which source is most credible or relevant?',
          'What information is unique to each source versus overlapping?',
          'How do I synthesize multiple viewpoints into a coherent understanding?'
        ],
      },
    ],
  },
  {
    type: 'problem-solving',
    tags: [
      {
        tag: 'Word Problems',
        questions: [
          'How do I translate this word problem into mathematical equations?',
          'What are the key variables or unknowns in this problem?',
          'How do I organize complex information in word problems?',
          'What are common traps in word problem structures?',
          'How do I check if my answer makes sense in the context?'
        ],
      },
      {
        tag: 'Arithmetic',
        questions: [
          'What arithmetic properties can I apply to this problem?',
          'How do I simplify complex arithmetic calculations?',
          'What shortcuts work for arithmetic computation?',
          'How do I handle problems with multiple operations?',
          'What estimation techniques help verify arithmetic answers?'
        ],
      },
      {
        tag: 'Geometry',
        questions: [
          'What geometric formulas apply to this problem?',
          'How do I visualize or draw this geometric scenario?',
          'What properties of shapes are relevant here?',
          'How do I approach problems with overlapping shapes?',
          'What are common geometry calculation shortcuts?'
        ],
      },
      {
        tag: 'Algebra',
        questions: [
          'How do I set up and solve this algebraic equation?',
          'What algebraic manipulations simplify this problem?',
          'How do I approach problems with multiple variables?',
          'What are efficient ways to solve quadratic equations?',
          'How do I translate word constraints into algebraic expressions?'
        ],
      },
      {
        tag: 'Percent and Interest Problems',
        questions: [
          'What percent formulas apply to this problem?',
          'How do I handle consecutive percent changes?',
          'What\'s the best approach for compound interest calculations?',
          'How do I solve for original amounts in percent problems?',
          'What are common percent calculation shortcuts?'
        ],
      },
      {
        tag: 'Number Properties',
        questions: [
          'Which number properties are relevant to this problem?',
          'How do I test for divisibility or factors efficiently?',
          'What approaches work best for odd/even or prime properties?',
          'How do I handle problems with unknown integers?',
          'What patterns should I look for in number property questions?'
        ],
      },
      {
        tag: 'Fractions and Ratios',
        questions: [
          'How do I manipulate fractions efficiently in this problem?',
          'What approaches work best for ratio comparison?',
          'How do I convert between fractions, decimals, and percents strategically?',
          'What techniques help with complex fraction operations?',
          'How do I solve for unknown parts in ratio relationships?'
        ],
      },
      {
        tag: 'Multiples and Factors',
        questions: [
          'How do I find LCM or GCD efficiently?',
          'What approaches work for finding factors or divisors?',
          'How do I solve problems involving remainders?',
          'What techniques help with prime factorization?',
          'How do I handle problems with multiple divisibility conditions?'
        ],
      },
      {
        tag: 'Overlapping Sets',
        questions: [
          'How do I organize information about overlapping sets?',
          'What diagrams or formulas work best for set problems?',
          'How do I calculate elements in unions or intersections?',
          'What approaches work for three or more overlapping sets?',
          'How do I handle complementary sets or "not in any set" elements?'
        ],
      },
      {
        tag: 'Work and Rate Problems',
        questions: [
          'What formulas apply to work and rate problems?',
          'How do I handle multiple workers or machines?',
          'What approaches work for combined rates?',
          'How do I set up equations for work-time relationships?',
          'What are common pitfalls in work rate calculations?'
        ],
      },
      {
        tag: 'Exponents',
        questions: [
          'Which exponent rules apply to this problem?',
          'How do I simplify expressions with multiple exponents?',
          'What approaches work for solving equations with exponents?',
          'How do I handle fractional or negative exponents?',
          'What strategies help with exponential growth or decay problems?'
        ],
      },
      {
        tag: 'Statistics and Sets Problems',
        questions: [
          'How do I calculate mean, median, or mode efficiently?',
          'What approaches work for range or standard deviation?',
          'How do I solve problems with weighted averages?',
          'What techniques help with set operations and counting?',
          'How do I handle problems involving data distributions?'
        ],
      },
      {
        tag: 'Graphs and Illustrations',
        questions: [
          'How do I extract key information from this graph?',
          'What calculations can I perform using the visual data?',
          'How do I interpret slopes or areas in this illustration?',
          'What relationships are shown in this visualization?',
          'How do I translate between graphical and algebraic representations?'
        ],
      },
      {
        tag: 'Must or Could be True Questions',
        questions: [
          'How do I test what must be true versus could be true?',
          'What approaches help eliminate impossible scenarios?',
          'How do I identify necessary conditions versus possible ones?',
          'What testing strategies work for "must be true" questions?',
          'How do I find counterexamples for "could be true" options?'
        ],
      },
      {
        tag: 'Distance and Speed Problems',
        questions: [
          'What formulas apply to distance-rate-time problems?',
          'How do I handle relative motion or different directions?',
          'What approaches work for average speed calculations?',
          'How do I solve for unknown times or distances?',
          'What are common traps in speed and distance problems?'
        ],
      },
      {
        tag: 'Roots',
        questions: [
          'What properties of roots help solve this problem?',
          'How do I simplify expressions with square roots?',
          'What approaches work for equations with radicals?',
          'How do I handle higher-order roots?',
          'What are common pitfalls with root calculations?'
        ],
      },
      {
        tag: 'Min-Max Problems',
        questions: [
          'How do I find minimum or maximum values efficiently?',
          'What approaches work for optimizing expressions?',
          'How do I identify boundaries or constraints?',
          'What techniques help with extreme value problems?',
          'How do I test if I\'ve found the true minimum or maximum?'
        ],
      },
      {
        tag: 'Remainders',
        questions: [
          'What remainder properties are useful for this problem?',
          'How do I handle division with variables or unknowns?',
          'What approaches work for cyclical remainder patterns?',
          'How do I solve for remainders in complex expressions?',
          'What are common divisibility shortcuts for remainder problems?'
        ],
      },
      {
        tag: 'Mixture Problems',
        questions: [
          'What formulas apply to mixture or solution problems?',
          'How do I set up equations for concentrations or weighted averages?',
          'What approaches work for multiple mixture combinations?',
          'How do I calculate final concentrations or quantities?',
          'What are common pitfalls in mixture calculations?'
        ],
      },
      {
        tag: 'Sequences',
        questions: [
          'How do I identify patterns in sequences?',
          'What formulas apply to arithmetic or geometric sequences?',
          'How do I find specific terms or sums of sequences?',
          'What approaches work for recursive sequences?',
          'How do I handle convergent or divergent series?'
        ],
      },
      {
        tag: 'Inequalities',
        questions: [
          'How do I solve linear or quadratic inequalities?',
          'What techniques help graph or visualize inequality regions?',
          'How do I handle compound inequalities?',
          'What approaches work for absolute value inequalities?',
          'How do I test solution sets for inequalities?'
        ],
      },
      {
        tag: 'Probability',
        questions: [
          'What probability formulas apply to this problem?',
          'How do I identify dependent versus independent events?',
          'What approaches work for conditional probability?',
          'How do I calculate combinations or permutations efficiently?',
          'What strategies help visualize probability scenarios?'
        ],
      },
    ],
  },
  {
    type: 'reading-comprehension',
    tags: [
      {
        tag: 'Main Idea',
        questions: [
          'How do I identify the main point of the passage?',
          'What strategies help distinguish main ideas from supporting details?',
          'How do I recognize the author\'s primary purpose?',
          'What clues indicate the central theme versus subordinate points?',
          'How do I track the development of the main idea across paragraphs?'
        ],
      },
      {
        tag: 'Tone',
        questions: [
          'How do I identify the author\'s tone in this passage?',
          'What word choices or phrases reveal attitude or perspective?',
          'How do I distinguish between subtle tone differences?',
          'What strategies help recognize tone shifts within a passage?',
          'How do I avoid misinterpreting neutral academic tone?'
        ],
      },
      {
        tag: 'Purpose',
        questions: [
          'How do I determine the author\'s purpose in writing this passage?',
          'What clues indicate whether the author aims to inform, persuade, or criticize?',
          'How do I identify the function of specific paragraphs?',
          'What strategies help recognize unstated purposes?',
          'How do structure and content work together to reveal purpose?'
        ],
      },
      {
        tag: 'Detail',
        questions: [
          'What strategies help locate specific details efficiently?',
          'How do I distinguish between explicit statements and inferences?',
          'What approaches work for tracking multiple details?',
          'How do I determine which details support the main idea?',
          'What techniques help retain important details while reading?'
        ],
      },
      {
        tag: 'Inference',
        questions: [
          'How do I make valid inferences from the passage?',
          'What distinguishes supported inferences from unsupported ones?',
          'How do I avoid going beyond the text in inferences?',
          'What strategies help connect ideas for proper inferences?',
          'How do I recognize when information is implied rather than stated?'
        ],
      },
      {
        tag: 'Vocabulary',
        questions: [
          'How do I determine word meanings from context?',
          'What clues help understand unfamiliar terminology?',
          'How do I identify when words are used in specialized ways?',
          'What strategies help with technical vocabulary?',
          'How do I distinguish between literal and figurative usage?'
        ],
      },
      {
        tag: 'Structure',
        questions: [
          'How do I identify the organizational pattern of this passage?',
          'What transitions signal relationships between ideas?',
          'How do I recognize the function of each paragraph?',
          'What strategies help map the logical flow of the argument?',
          'How do I identify comparison, contrast, or cause-effect structures?'
        ],
      },
      {
        tag: 'Long Passage',
        questions: [
          'What strategies help manage time with long passages?',
          'How do I identify key information efficiently in longer texts?',
          'What note-taking approaches work best for lengthy passages?',
          'How do I maintain focus throughout a long reading?',
          'What skimming techniques help with initial orientation?'
        ],
      },
      {
        tag: 'Short Passage',
        questions: [
          'How do I extract maximum information from a concise passage?',
          'What strategies help analyze dense, short texts thoroughly?',
          'How do I avoid overlooking subtle points in brief passages?',
          'What techniques help identify unstated assumptions in short texts?',
          'How do I analyze structural elements in compact passages?'
        ],
      },
      {
        tag: 'Social Science',
        questions: [
          'What reading strategies work best for social science passages?',
          'How do I analyze arguments in social science contexts?',
          'What approaches help understand social science terminology?',
          'How do I evaluate evidence in social science writing?',
          'What common structures appear in social science passages?'
        ],
      },
      {
        tag: 'Science',
        questions: [
          'What strategies help comprehend scientific passages?',
          'How do I handle technical terminology in science writing?',
          'What approaches work for understanding scientific processes?',
          'How do I identify hypotheses versus established facts?',
          'What techniques help visualize scientific concepts while reading?'
        ],
      },
      {
        tag: 'Humanities',
        questions: [
          'What strategies work best for humanities passages?',
          'How do I analyze subjective or interpretive content?',
          'What approaches help understand cultural or historical context?',
          'How do I identify themes in humanities writing?',
          'What techniques help with abstract or philosophical concepts?'
        ],
      },
      {
        tag: 'Business',
        questions: [
          'What strategies help comprehend business-focused passages?',
          'How do I analyze case studies or business scenarios?',
          'What approaches work for business terminology or concepts?',
          'How do I evaluate business arguments or recommendations?',
          'What techniques help identify key business insights or principles?'
        ],
      },
    ],
  },
  {
    type: 'table-analysis',
    tags: [
      {
        tag: 'Tables',
        questions: [
          'How do I efficiently scan this table to find the relevant data?',
          'What key relationships should I identify between columns/rows?',
          'How do I spot patterns or trends in tabular data?',
          'What calculation shortcuts can I use with this table?',
          'How should I organize my scratch work for table problems?',
          'What hidden information might this table contain?',
          'How do I verify my interpretations of the table data?',
          'What common mistakes do students make with tables like this?',
          'How do I handle tables with missing or incomplete data?',
          'What\'s the most efficient way to compare values across this table?',
        ],
      },
      {
        tag: 'Math Related',
        questions: [
          'How do I calculate percentages from this tabular data?',
          'What formulas should I apply to analyze this table?',
          'How do I identify which calculations are actually necessary?',
          'What mathematical relationships exist between columns/rows?',
          'How do I convert between different units shown in the table?',
          'What statistical concepts apply to this table data?',
          'How do I determine ratios or proportions from this table?',
          'What averaging techniques work best with this tabular data?',
          'How do I handle data points that seem like outliers?',
          'What\'s the most efficient way to sum or multiply table values?',
        ],
      },
      {
        tag: 'Non-Math Related',
        questions: [
          'How do I infer relationships not explicitly stated in the table?',
          'What conclusions can reasonably be drawn from this data?',
          'How do I distinguish between correlation and causation in this table?',
          'What additional context would help interpret this data?',
          'How should I interpret gaps or inconsistencies in the data?',
          'What assumptions should I avoid making about this table?',
          'How do I evaluate the reliability of information in this table?',
          'What background knowledge helps interpret this table?',
          'How do I connect this tabular data to the question stem?',
          'What contextual clues help me understand the significance of certain data points?',
        ],
      },
    ],
  },
  {
    type: 'two-part-analysis',
    tags: [
      {
        tag: 'Two-Part Questions',
        questions: [
          'How do I recognize the relationship between the two parts?',
          'What\'s the most efficient order to solve the two parts?',
          'How do I organize my work for two-part questions?',
          'What\'s the best strategy to eliminate answer pairs?',
          'How do I verify both parts of my answer work together?',
          'What common misconceptions lead to errors in two-part questions?',
          'How do I approach questions with dependent vs. independent parts?',
          'What techniques help match corresponding values in answer choices?',
          'How do I avoid solving only half the question?',
          'What time management strategies work for these complex questions?',
        ],
      },
      {
        tag: 'Math Related',
        questions: [
          'How do I set up equations for both parts of the problem?',
          'What mathematical constraints connect the two parts?',
          'How do I use one part\'s solution to solve the other part?',
          'What algebraic techniques work best for these paired problems?',
          'How do I handle systems of equations in two-part questions?',
          'What shortcuts can I use for calculating both values?',
          'How do I verify my calculations satisfy both conditions?',
          'What visualization techniques help solve mathematical pairs?',
          'How do I systematically test paired answer choices?',
          'What patterns connect the two mathematical components?',
        ],
      },
      {
        tag: 'Non-Math Related',
        questions: [
          'How do I identify logical relationships between the two parts?',
          'What framework helps organize verbal two-part analyses?',
          'How do I evaluate the strength of different paired relationships?',
          'What techniques help match characteristics to entities?',
          'How do I efficiently map corresponding elements?',
          'What reasoning patterns appear in non-math two-part questions?',
          'How do I systematically eliminate paired choices?',
          'What common logical fallacies appear in these questions?',
          'How do I distinguish between necessary and sufficient conditions?',
          'What strategies help visualize abstract relationships?',
        ],
    }
    ],
    },
]