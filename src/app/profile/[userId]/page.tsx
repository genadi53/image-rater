"use client";

import { useQuery } from "convex/react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { api } from "../../../../convex/_generated/api";
import Empty from "@/components/Empty";
import TestCard from "@/components/TestCard";
import UserAvatar from "@/components/UserAvatar";
import React from "react";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

const UserTests: React.FC<{ userId: string }> = ({ userId }) => {
  const userTests = useQuery(api.images.getImageTestsByUser, {
    userId: userId,
  });

  const sortedTests = [...(userTests ?? [])].reverse();

  return (
    <>
      {userTests === undefined && (
        <div className="animate-pulse my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {userTests && userTests.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="mx-auto">
            <Empty message="User have no image tests" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-12 gap-8">
        {sortedTests?.map((test) => {
          return <TestCard key={test._id} imageTest={test} />;
        })}
      </div>
    </>
  );
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  const userId = params.userId;
  const user = useQuery(api.users.getUserProfile, {
    userId: params.userId,
  });

  return (
    <div className="grid grid-cols-3 mt-12">
      <div className="flex flex-col gap-2 items-center">
        <UserAvatar
          styles={"w-40 h-40"}
          imageUrl={user?.profileImage}
          name={user?.name}
        />
        <h1 className="text-2xl mt-2">{user?.name}</h1>

        <div className="w-full my-8 flex justify-center">
          <Button className="w-1/3">Hello</Button>
        </div>
      </div>
      <div className="col-span-2">
        <div className="mt-8 flex items-center">
          <UserTests userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
