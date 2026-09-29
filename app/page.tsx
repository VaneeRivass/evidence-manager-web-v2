import { redirect } from 'next/navigation'

// The root is not a screen: send everyone to their cases. With no session the
// middleware intercepts /cases and takes them to /login first (RF-14).
export default function Home() {
  redirect('/cases')
}
