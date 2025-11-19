import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert fitness and nutrition coach. Generate personalized workout and diet plans based on user information. Be specific, practical, and motivating. Format your response with clear sections.`;

    const userPrompt = `Generate a comprehensive fitness plan for:
- Name: ${userData.name}
- Age: ${userData.age}, Gender: ${userData.gender}
- Height: ${userData.height}cm, Weight: ${userData.weight}kg
- Fitness Goal: ${userData.fitnessGoal}
- Fitness Level: ${userData.fitnessLevel}
- Workout Location: ${userData.workoutLocation}
- Dietary Preference: ${userData.dietaryPreference}
${userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ''}
${userData.stressLevel ? `- Stress Level: ${userData.stressLevel}` : ''}

Create:
1. A detailed 7-day workout plan with specific exercises, sets, reps, and rest times
2. A complete daily diet plan with meal breakdowns (breakfast, lunch, dinner, snacks)
3. Lifestyle tips, posture advice, and motivational quotes

Format the response as:
# WORKOUT PLAN
[detailed workout content]

# DIET PLAN
[detailed diet content]

# TIPS & MOTIVATION
[tips and motivation]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const fullPlan = data.choices[0].message.content;

    // Parse the response into sections
    const workoutMatch = fullPlan.match(/# WORKOUT PLAN\n([\s\S]*?)(?=# DIET PLAN|$)/);
    const dietMatch = fullPlan.match(/# DIET PLAN\n([\s\S]*?)(?=# TIPS & MOTIVATION|$)/);
    const tipsMatch = fullPlan.match(/# TIPS & MOTIVATION\n([\s\S]*?)$/);

    const plan = {
      workout: workoutMatch ? workoutMatch[1].trim() : '',
      diet: dietMatch ? dietMatch[1].trim() : '',
      tips: tipsMatch ? tipsMatch[1].trim() : '',
    };

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-plan function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
