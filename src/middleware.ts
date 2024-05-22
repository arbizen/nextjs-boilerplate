import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import {
  ResponseCookies,
  RequestCookies,
} from 'next/dist/server/web/spec-extension/cookies';

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
  const res = NextResponse.next();

  const sessionId = cookies().get('sessionId')?.value;
  if (!sessionId) {
    const randomSessionId = uuidv4();
    console.log('Session not found.', 'Setting session ID:', randomSessionId);
    res.cookies.set('sessionId', randomSessionId, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5), // 5 years
    });
    applySetCookie(request, res);
  } else {
    console.log('Session ID:', sessionId);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
