import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { generateChatResponse } from '@/app/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, chatSessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let chatSession;

    // If chatSessionId is provided, find the existing chat session
    if (chatSessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: {
          id: chatSessionId,
          userId: session.user.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!chatSession) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }
    } else {
      // Create a new chat session
      chatSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
          messages: {
            create: {
              content: message,
              role: 'user',
            },
          },
        },
        include: {
          messages: true,
        },
      });
    }

    // If it's an existing session, add the new user message
    if (chatSessionId) {
      await prisma.message.create({
        data: {
          chatSessionId: chatSession.id,
          content: message,
          role: 'user',
        },
      });

      // Refresh the messages
      chatSession = await prisma.chatSession.findUnique({
        where: {
          id: chatSession.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    }

    // Format messages for Anthropic API
    const formattedMessages = chatSession!.messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await generateChatResponse(formattedMessages);

    // Save AI response to database
    const savedAiMessage = await prisma.message.create({
      data: {
        chatSessionId: chatSession!.id,
        content: aiResponse.content[0].text,
        role: 'assistant',
      },
    });

    return NextResponse.json({
      chatSessionId: chatSession!.id,
      message: savedAiMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your message' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const chatSessionId = url.searchParams.get('chatSessionId');

    if (chatSessionId) {
      // Get a specific chat session
      const chatSession = await prisma.chatSession.findUnique({
        where: {
          id: chatSessionId,
          userId: session.user.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!chatSession) {
        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
      }

      return NextResponse.json(chatSession);
    } else {
      // Get all chat sessions for the user
      const chatSessions = await prisma.chatSession.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      return NextResponse.json(chatSessions);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching chat sessions' },
      { status: 500 }
    );
  }
}
