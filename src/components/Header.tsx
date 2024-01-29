"use client";

import { useIsSubscribed } from "@/hooks/useIsSubscribed";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./ThemeToggle";
import UpgradeButton from "./UpagradeButton";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const { isSubscribed } = useIsSubscribed();

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
            <Link className="link" href={"/explore"}>
              Explore
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
            {!isSubscribed && <UpgradeButton />}
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
