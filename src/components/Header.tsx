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

        <div className="flex gap-8">
          <SignedIn>
            <Link className="link" href={"/create"}>
              Create
            </Link>
            <Link className="link" href={"/dashboard"}>
              Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <Link className="link" href={"/about"}>
              About
            </Link>
            <Link className="link" href={"/pricing"}>
              Pricing
            </Link>
          </SignedOut>
        </div>

        <div className="flex gap-8 items-center">
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
