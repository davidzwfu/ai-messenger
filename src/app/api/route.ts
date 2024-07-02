import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { usersData } from '@/app/_data/users'

const openai = new OpenAI()
 
export async function POST(request: NextRequest) {
  const { userId, conversation } = await request.json()
  const messages = conversation.map((message: any) => {
    return {
      role: message.self ? 'user' : 'assistant',
      content: message.content,
    }
  })
  const prompt = usersData[userId].prompt
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 1,
    max_tokens: 300,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: prompt },
      ...messages.slice(-20),
    ],
  })
  console.log(completion)
  return NextResponse.json(completion.choices[0])
}
