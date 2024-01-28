"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ThemeToggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const router = useRouter();
  const pay = useAction(api.stripe.pay);
  const user = useQuery(api.users.getUser);

  const handleProfileUpgrade = async () => {
    const url = await pay();
    router.push(url);
  };

  const isSubscribed = user && (user.endsOn ?? 0) > Date.now();

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
            {!isSubscribed && (
              <Button variant={"outline"} onClick={handleProfileUpgrade}>
                Upgrade
              </Button>
            )}
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
