'use client'
import { useSession } from "next-auth/react";
import JournalEntryForm from "../../../components/JournalEntryForm";

export default function Page() {
    const session = useSession();
    // console.log(session)

    if ((session as any).status === 'loading') {
        return <p>Loading... Session object exists</p>;
    } else if ((session as any).status === 'authenticated') {
        return (
            <JournalEntryForm/>
        )
    }
    return <p>Unauthenticated or session Does Not Exist</p>;
}