import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const requestCookie = request.cookies.get('sessionId')?.value;
  const requestUserId = request.cookies.get('userId')?.value;
  const requestEvent = request.cookies.get('event')?.value;
  const requestPathOrigin = request.cookies.get('pathOrigin')?.value;
  const requestLang = request.cookies.get('lang')?.value;

  if (!requestCookie) {
    const randomSessionId = uuidv4();
    const userId = uuidv4();
    response.cookies.set({
      name: 'sessionId',
      value: randomSessionId,
      path: '/',
    });
    response.cookies.set({
      name: 'userId',
      value: userId,
      path: '/',
    });
    response.cookies.set({
      name: 'event',
      value: 'some event',
      path: '/',
    });
    response.cookies.set({
      name: 'pathOrigin',
      value: 'some path origin',
      path: '/',
    });
    response.cookies.set({
      name: 'lang',
      value: 'en',
      path: '/',
    });
    console.log('Session not found.', 'Setting session ID:', randomSessionId);
  } else {
    console.log(`--------------------------------`);
    console.log('Session ID:', requestCookie);
    console.log('User ID:', requestUserId);
    console.log('Event:', requestEvent);
    console.log('Path Origin:', requestPathOrigin);
    console.log('Language:', requestLang);
    console.log('---------------------------------');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
