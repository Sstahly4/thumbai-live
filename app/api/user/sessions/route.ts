import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

// Define a type for the session user that includes id
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add other fields from your ExtendedUser if needed by this route
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as SessionUser).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as SessionUser).id;

  try {
    const userSessions = await prisma.session.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        lastSeenAt: 'desc', // Show most recently active sessions first
      },
      select: {
        id: true, // The session's own unique ID
        sessionToken: true, // The token NextAuth uses
        expires: true,
        lastSeenAt: true,
        ipAddress: true, // Will be null for now
        userAgent: true, // Will be null for now
        // location: true, // Also null for now
      },
    });

    return NextResponse.json(userSessions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
} 