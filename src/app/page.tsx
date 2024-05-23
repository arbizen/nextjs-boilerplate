import axios from 'axios';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const sessionId = cookies().get('sessionId')?.value;
  const userId = cookies().get('userId')?.value;
  const event = cookies().get('event')?.value;
  const pathOrigin = cookies().get('pathOrigin')?.value;
  const lang = cookies().get('lang')?.value;
  console.log('Session ID:', sessionId);
  const res = await axios.get(
    `https://backend.recovo.me/api/products/get-all-group-sku-by-slug/en/mostaza-algod%C3%B3n-french-terry`,
    { headers: { sessionId, userId, event, pathOrigin, lang } },
  );
  const data = await res.data;
  return <div>{JSON.stringify(data)}</div>;
}
