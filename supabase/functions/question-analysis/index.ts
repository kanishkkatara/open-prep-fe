import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'
import { Configuration, OpenAIApi } from 'npm:openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (userError || !user) {
      throw new Error('Invalid user')
    }

    const { questionId, selectedAnswer } = await req.json()

    // Get question details
    const { data: question } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (!question) {
      throw new Error('Question not found')
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Generate analysis with AI
    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a GMAT question analysis expert. Analyze the student's approach and provide feedback:

Question Type: ${question.type}
Topic: ${question.topic}
Subtopic: ${question.subtopic}
Difficulty: ${question.difficulty}

Question: ${question.question_text}

Selected Answer: ${selectedAnswer}
Correct Answer: ${question.correct_answer}

Your analysis should:
- Identify the key concepts tested
- Explain why the selected answer is correct/incorrect
- Point out common misconceptions
- Provide strategic insights for similar questions
- Suggest specific areas for review if needed
- Maintain an encouraging tone while being direct about errors`,
        },
        {
          role: 'user',
          content: 'Analyze my answer and provide detailed feedback.',
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const analysis = completion.data.choices[0].message?.content

    if (!analysis) {
      throw new Error('Failed to generate analysis')
    }

    return new Response(
      JSON.stringify({ analysis }),
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