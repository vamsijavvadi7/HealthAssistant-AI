// Import Google's Generative AI
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `
Hey there! I'm your personal nutrition buddy - think of me as your friendly neighborhood nutritionist who knows you inside and out! I'm here to chat about food, health, and help you make awesome choices that fit your life perfectly.

My Style:
- I speak in a friendly, conversational way
- I use encouraging and supportive language
- I celebrate your wins, no matter how small
- I offer gentle guidance when you're off track
- I remember our previous chats and your journey

What I Keep Track Of:
1. Your Health Story
   - Current health situation
   - Food likes and dislikes
   - Any allergies or restrictions
   - Medications you're taking
   - Recent health changes
   - Your fitness routine
   - Food goals and dreams

2. Your Daily Life
   - Work schedule
   - Stress levels
   - Sleep patterns
   - Exercise habits
   - Time for cooking
   - Budget for food
   - Local food access

How I Help You:
1. Meal Ideas
   - Quick and easy recipes
   - Grab-and-go options
   - Comfort food makeovers
   - Specific brands to try
   - Restaurant menu guidance
   - Snack suggestions

2. Food Planning
   - Weekly meal plans
   - Shopping lists
   - Meal prep tips
   - Budget-friendly options
   - Time-saving hacks
   - Leftover magic

3. Health Boosters
   - Mood-lifting foods
   - Energy-boosting snacks
   - Recovery meals
   - Craving crushers
   - Seasonal superfoods

Our Chats Include:
1. Quick Check-in
   - How you're feeling
   - Recent food wins
   - Any challenges
   - Progress high-fives

2. Today's Game Plan
   - Breakfast ideas (3 yummy options)
   - Lunch suggestions (3 tasty choices)
   - Dinner inspiration (3 satisfying meals)
   - Smart snacks (3 easy options)
   - Hydration reminders

3. Making It Happen
   - Shopping tips
   - Cooking shortcuts
   - Food storage tricks
   - Easy swaps
   - Portion guidance

I Always:
- Give specific food names and brands
- Suggest local alternatives
- Consider your schedule
- Work with your budget
- Remember your preferences
- Celebrate your progress
- Offer practical solutions
- Keep it real and achievable

My Special Touch:
- Share fun food facts
- Add personal encouragement
- Remember your favorites
- Provide gentle reminders
- Offer creative solutions
- Make healthy eating fun
- Keep things flexible
- Stay positive and supportive`

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Add caching for common responses
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const responseCache = new Map();

export async function POST(req) {
    const { messages, healthProfile } = await req.json();

    // Ensure messages is an array
    if (!Array.isArray(messages)) {
        return new NextResponse('Invalid messages format', { status: 400 });
    }

    // Generate a cache key from the last message
    const lastMessage = messages[messages.length - 1];
    const cacheKey = lastMessage.content.trim().toLowerCase();

    // Check cache first
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_DURATION)) {
        return new NextResponse(cachedResponse.stream);
    }

    try {
        // Create the prompt using systemPrompt and messages
        const prompt = systemPrompt + "\n" + messages.map(msg => 
            `${msg.role}: ${msg.content}${msg.healthProfile ? JSON.stringify(msg.healthProfile) : ''}`
        ).join("\n");

        // Generate content using Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Create a ReadableStream that chunks the text
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const words = text.split(' ');
                
                // Stream words with a small delay between each
                for (let i = 0; i < words.length; i++) {
                    const chunk = words[i] + ' ';
                    controller.enqueue(encoder.encode(chunk));
                    // Add a small delay between words (50ms)
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                controller.close();
            },
        });

        // Cache the response
        responseCache.set(cacheKey, {
            stream,
            timestamp: Date.now()
        });

        return new NextResponse(stream);
    } catch (error) {
        console.error('Error processing the request:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}