import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatSessionId = searchParams.get('chatSessionId');

    if (!chatSessionId) {
      return NextResponse.json({ error: 'Chat session ID is required' }, { status: 400 });
    }

    // Check if the chat session belongs to the user
    const chatSession = await prisma.chatSession.findUnique({
      where: {
        id: chatSessionId,
        userId: session.user.id,
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // Delete the chat session
    await prisma.chatSession.delete({
      where: {
        id: chatSessionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the chat session' },
      { status: 500 }
    );
  }
}