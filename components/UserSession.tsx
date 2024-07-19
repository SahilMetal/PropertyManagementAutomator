import { useSession, signIn, signOut } from 'next-auth/react'
// import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
// import { cn } from '@/lib/utils'
export default function UserSession() {
    const { data: session } = useSession()
    const pathname = usePathname()
    return (
        <main className={'bg-slate-300/90'}>
        <div className='flex flex-col space-y-4'>
            {session && (
                <>
                <h2 className='text-xl font-bold'> You&apos;re signed in as:</h2>
                <pre>{JSON.stringify(session.user?.name)} </pre> 
                <button className='mt-3' onClick={() => signOut()}> Sign out </button> </> )} 
                {!session && pathname !== '/signin' && ( <button onClick={() => signIn()}>Sign In</button> )} </div> </main> ) }