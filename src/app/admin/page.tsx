import { auth } from '@/../auth';
 
export default async function Page() {
  const session = await auth(); 
  if ((session as any)?.user.role === "admin") {
    return <p>You are an admin, welcome!</p>;
  }
 
  return <p>You are not authorized to view this page!</p>;
}