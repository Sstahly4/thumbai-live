import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function DELETE(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as SessionUser).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as SessionUser).id;
  const { sessionId } = params;

  try {
    // First verify the session belongs to the user
    const sessionToDelete = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!sessionToDelete) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the session
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
} 