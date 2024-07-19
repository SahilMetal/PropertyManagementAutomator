import { auth } from "@/../auth"
 
export default async function Page() {
  const session = await auth() // bingo
  if (!session) return <div>Not authenticated</div>
  if ((session as any)?.user.role == 'user' || 'admin') {
    return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
    )
  }
}