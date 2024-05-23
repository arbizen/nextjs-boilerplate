import axios from 'axios';
import { cookies } from 'next/headers';

export default async function Page() {
  const sessionId = cookies().get('sessionId')?.value;
  console.log('Session ID:', sessionId);
  const res = await axios.get(
    `https://backend.recovo.me/api/products/get-all-group-sku-by-slug/en/mostaza-algod%C3%B3n-french-terry`,
    { headers: { sessionId: sessionId } },
  );
  const data = await res.data;
  return <div>{JSON.stringify(data)}</div>;
}
