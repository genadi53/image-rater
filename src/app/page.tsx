"use client";
import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-black">
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
    </main>
  );
}
