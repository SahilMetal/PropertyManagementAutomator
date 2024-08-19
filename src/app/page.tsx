'use client'
import SignIn from "@/../components/Sign-in"
import UserSession from '../../components/UserSession'

export default function Page () {
  return (
    <>
      <h2>Home Page</h2>
      <SignIn />
      <div>
        <a href="/api/auth/signin">Login </a>
        <a href="/api/auth/signout">Logout </a>
      </div>
      <a href="/admin">Admin </a>
      <a href="/api/auth/me">Session </a>
      <a href="/testing">Test Page </a>
      <UserSession />
    </>
  )
}