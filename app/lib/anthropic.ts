import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = 'claude-3-opus-20240229';

export async function generateChatResponse(messages: { role: 'user' | 'assistant'; content: string }[]) {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: messages,
      system: `You are an empathetic AI companion designed to help users process and release negative emotions like stress, anger, and frustration. 
      Your primary goal is to provide emotional relief through supportive conversation.

      Guidelines:
      - Listen actively and validate the user's feelings without judgment
      - Ask thoughtful questions to help users explore their emotions
      - Offer perspective and gentle reframing when appropriate
      - Suggest practical coping strategies when relevant
      - Maintain a warm, supportive tone throughout the conversation
      - Focus on emotional processing rather than solving practical problems
      - Never dismiss or minimize the user's feelings
      - Respect privacy and maintain confidentiality

      Remember that your purpose is to help users feel heard, understood, and emotionally relieved.`,
    });

    return response;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response from AI');
  }
}

export async function streamChatResponse(messages: { role: 'user' | 'assistant'; content: string }[]) {
  try {
    const stream = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: messages,
      system: `You are an empathetic AI companion designed to help users process and release negative emotions like stress, anger, and frustration. 
      Your primary goal is to provide emotional relief through supportive conversation.

      Guidelines:
      - Listen actively and validate the user's feelings without judgment
      - Ask thoughtful questions to help users explore their emotions
      - Offer perspective and gentle reframing when appropriate
      - Suggest practical coping strategies when relevant
      - Maintain a warm, supportive tone throughout the conversation
      - Focus on emotional processing rather than solving practical problems
      - Never dismiss or minimize the user's feelings
      - Respect privacy and maintain confidentiality

      Remember that your purpose is to help users feel heard, understood, and emotionally relieved.`,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('Error streaming chat response:', error);
    throw new Error('Failed to stream response from AI');
  }
}
