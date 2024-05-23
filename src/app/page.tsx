import axios from 'axios';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const sessionId = cookies().get('sessionId')?.value;
  const userId = cookies().get('userId')?.value;
  const event = cookies().get('event')?.value;
  const pathOrigin = cookies().get('pathOrigin')?.value;
  const lang = cookies().get('lang')?.value;
  // const res = await axios.get(
  //   `https://backend.recovo.me/api/products/get-all-group-sku-by-slug/en/mostaza-algod%C3%B3n-french-terry`,
  //   { headers: { sessionId, userId, event, pathOrigin, lang } },
  // );
  //const data = await res.data;
  const res = await fetch(
    `https://backend.recovo.me/api/tests/ssr-session-id`,
    {
      headers: {
        sessionId: sessionId as string,
        userId: userId as string,
        event: event as string,
        pathOrigin: pathOrigin as string,
        lang: lang as string,
      },
    },
  );
  const data = await res.json();
  return (
    <div>
      <div>Session </div>
      <div>
        SessionId: {sessionId}
        <br />
        UserId: {userId}
        <br />
        Event: {event}
        <br />
        Path Origin: {pathOrigin}
        <br />
        Language: {lang}
        <br />
      </div>
    </div>
  );
}
