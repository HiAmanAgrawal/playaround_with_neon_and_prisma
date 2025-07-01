'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <h2>You are not logged in</h2>
        <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {session.user?.name}!</h2>
      <button onClick={() => signOut()}>Log out</button>
    </div>
  );
}
