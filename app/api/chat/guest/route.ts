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
    const formattedMessages = [
      {
        role: 'user',
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
              fullContent += chunk.delta.text;
              chunkCount++;

              // Send the chunk to the client
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                messageId: 'guest-' + Date.now(),
                content: chunk.delta.text,
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