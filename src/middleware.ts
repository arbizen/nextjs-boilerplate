import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import {
  ResponseCookies,
  RequestCookies,
} from 'next/dist/server/web/spec-extension/cookies';

export const runtime = 'experimental-edge';

function applySetCookie(req: NextRequest, res: NextResponse) {
  // 1. Parse Set-Cookie header from the response
  const setCookies = new ResponseCookies(res.headers);
  // 2. Construct updated Cookie header for the request
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));

  // 3. Set up the “request header overrides” (see https://github.com/vercel/next.js/pull/41380)
  //    on a dummy response
  // NextResponse.next will set x-middleware-override-headers / x-middleware-request-* headers
  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  // 4. Copy the “request header overrides” headers from our dummy response to the real response
  dummyRes.headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
}

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
    applySetCookie(request, response);
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
