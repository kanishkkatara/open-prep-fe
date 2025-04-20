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

    // Get user profile and performance data
    const { data: userData } = await supabaseClient
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    const { data: questionAttempts } = await supabaseClient
      .from('question_attempts')
      .select('*, questions(*)')
      .eq('user_id', userData.id)

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Generate study plan with AI
    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a GMAT study plan expert. Create a personalized study plan based on:
- Target score: ${userData.target_score}
- Exam date: ${userData.exam_date}
- Weekly study hours: ${userData.weekly_study_hours}
- Preferred times: ${userData.preferred_study_times.join(', ')}
- Learning style: ${userData.learning_style.join(', ')}
- Current performance data across ${questionAttempts?.length || 0} questions

The plan should:
- Prioritize weak areas while maintaining strong ones
- Account for the user's schedule and learning preferences
- Include specific modules and practice recommendations
- Set realistic milestones and progress checks
- Provide contingency time for review and mock tests`,
        },
        {
          role: 'user',
          content: 'Generate a detailed study plan based on my profile and performance data.',
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const studyPlan = completion.data.choices[0].message?.content

    if (!studyPlan) {
      throw new Error('Failed to generate study plan')
    }

    // Parse and structure the AI-generated plan
    const structuredPlan = {
      start_date: new Date(),
      end_date: new Date(userData.exam_date),
      weekly_schedule: {
        // Structure the weekly schedule based on preferred times
        days: userData.preferred_study_times.map((time) => ({
          time,
          duration: Math.floor(userData.weekly_study_hours / userData.preferred_study_times.length),
        })),
      },
      modules: [], // To be populated based on the AI response
      progress: {
        completed: [],
        current: null,
      },
    }

    // Store the study plan
    const { data: savedPlan, error: planError } = await supabaseClient
      .from('study_plans')
      .insert({
        user_id: userData.id,
        ...structuredPlan,
      })
      .select()
      .single()

    if (planError) {
      throw planError
    }

    return new Response(
      JSON.stringify({ plan: savedPlan, recommendations: studyPlan }),
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