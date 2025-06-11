import { streamChatResponse } from './anthropic';

/**
 * Wraps the original streamChatResponse function and adds a delay between chunks
 * to slow down the streaming process and reduce the chance of errors.
 * 
 * @param messages The messages to send to the AI
 * @param delayMs The delay in milliseconds between chunks (default: 50ms)
 * @returns A stream of AI responses with added delay
 */
export async function streamChatResponseWithDelay(
  messages: { role: 'user' | 'assistant'; content: string }[],
  delayMs: number = 50
) {
  const originalStream = await streamChatResponse(messages);
  
  // Create a wrapper around the original stream that adds a delay
  const delayedStream = {
    [Symbol.asyncIterator]() {
      const originalIterator = originalStream[Symbol.asyncIterator]();
      
      return {
        async next() {
          const result = await originalIterator.next();
          
          if (!result.done) {
            // Add a delay before returning the chunk
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
          
          return result;
        }
      };
    }
  };
  
  return delayedStream;
}