import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'
import { Configuration, OpenAIApi } from 'npm:openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (userError || !user) {
      throw new Error('Invalid user')
    }

    // Get request data
    const { messages, context } = await req.json()

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Prepare the messages array with system prompt
    const systemPrompt = getSystemPrompt(context)
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    // Get AI response
    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo-preview',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = completion.data.choices[0].message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Store the chat session
    await supabaseClient.from('chat_sessions').insert({
      user_id: user.id,
      context,
      messages: [...messages, { role: 'assistant', content: aiResponse }],
    })

    return new Response(
      JSON.stringify({ message: aiResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

function getSystemPrompt(context: string): string {
  const basePrompt = `You are OpenPrep AI, an expert GMAT tutor with deep knowledge of all GMAT topics and test-taking strategies. You provide clear, concise explanations and adapt your teaching style to each student's needs.

Key Guidelines:
- Break down complex concepts into understandable steps
- Use examples to illustrate points when helpful
- Maintain an encouraging and supportive tone
- Focus on teaching understanding, not just memorization
- Provide strategic insights for test-taking
- Never reveal answers directly for practice questions
- Give hints that guide students to discover solutions themselves

Your responses should be:
- Clear and well-structured
- Focused on the specific question or topic
- Encouraging but professional
- Backed by GMAT expertise and best practices`

  switch (context) {
    case 'question_help':
      return `${basePrompt}

When helping with GMAT questions:
- Never give away the answer directly
- Start with clarifying questions if the student's approach isn't clear
- Guide students through the logical steps to reach the solution
- Point out common traps and misconceptions
- Teach the underlying concepts and patterns
- Provide similar example problems when helpful
- Explain why wrong approaches don't work`

    case 'study_planning':
      return `${basePrompt}

For study planning advice:
- Consider the student's target score and timeline
- Account for strengths and weaknesses
- Recommend specific study strategies and resources
- Help prioritize topics based on impact
- Suggest realistic study schedules
- Provide tips for maintaining motivation
- Address time management and burnout prevention`

    case 'performance_review':
      return `${basePrompt}

When reviewing performance:
- Analyze patterns in mistakes and successes
- Identify knowledge gaps and areas for improvement
- Suggest specific strategies for improvement
- Compare performance to target goals
- Provide actionable next steps
- Keep feedback constructive and motivating
- Focus on progress and growth opportunities`

    default:
      return basePrompt
  }
}