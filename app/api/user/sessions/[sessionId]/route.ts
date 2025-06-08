import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { User } from 'next-auth';

export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { sessionId } = params;

  try {
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