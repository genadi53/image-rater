"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ThemeToggle";
import Link from "next/link";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header className="border-b">
      <div className="h-16 p-2 container flex justify-between items-center">
        <div>Logo</div>

        <div>
          <SignedIn>
            <Link href={"/create"}>Create</Link>
          </SignedIn>
          <SignedOut>
            <Link href={"/about"}>About</Link>
            <Link href={"/pricing"}>Pricing</Link>
          </SignedOut>
        </div>

        <div className="flex gap-4 items-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
