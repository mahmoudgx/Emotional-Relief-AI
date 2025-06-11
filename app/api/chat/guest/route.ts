import { NextRequest } from 'next/server';
import { streamChatResponseWithDelay } from '@/app/lib/delayedStream';

export async function GET(req: NextRequest) {
  try {
    // Get message from query parameters
    const searchParams = req.nextUrl.searchParams;
    const message = searchParams.get('message');

    console.log('Guest chat request received with message:', message);

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format messages for AI API - for guest users, we don't maintain conversation history
    const formattedMessages: { role: "user" | "assistant"; content: string; }[] = [
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Set up Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the initial message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            messageId: 'guest-' + Date.now(),
            content: '',
            done: false
          })}\n\n`));

          // Stream the AI response
          console.log('Starting to stream AI response for guest user');
          const aiStream = await streamChatResponseWithDelay(formattedMessages);
          let fullContent = '';
          let chunkCount = 0;

          for await (const chunk of aiStream) {
            console.log('Received chunk from AI:', chunk);
            if (chunk.type === 'content_block_delta') {
              let content = '';

              // Handle different delta types
              if (chunk.delta.type === 'text_delta') {
                content = chunk.delta.text;
                fullContent += content;
              } else if (chunk.delta.type === 'input_json_delta') {
                content = chunk.delta.partial_json;
                fullContent += content;
              }

              chunkCount++;

              // Send the chunk to the client
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                messageId: 'guest-' + Date.now(),
                content: content,
                done: false
              })}\n\n`));
            }
          }

          console.log(`Guest streaming complete. Sent ${chunkCount} chunks. Full content length: ${fullContent.length}`);

          // Send the final message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            messageId: 'guest-' + Date.now(),
            content: '',
            done: true
          })}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Error streaming chat response for guest:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            error: 'An error occurred while streaming the response',
            done: true
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Guest chat stream connection error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while establishing the connection' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
