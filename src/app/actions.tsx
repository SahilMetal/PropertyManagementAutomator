'use server'
 
import { cookies } from 'next/headers'
 
async function create() {
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}

create();