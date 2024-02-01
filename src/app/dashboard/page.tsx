"use client";

import TestCard from "@/components/TestCard";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Empty from "@/components/Empty";
import { SkeletonCard } from "@/components/SkeletonCard";

const DashboardPage = () => {
  const userTests = useQuery(api.images.getMyImageTests);
  const sortedTests = [...(userTests ?? [])].reverse();

  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.getLoggedUser,
    !isAuthenticated ? "skip" : undefined
  );

  const deleteTest = useMutation(api.images.deleteImageTest);

  return (
    <div className="pt-12">
      <h1 className="text-center text-4xl font-bold mb-12">Your Image Tests</h1>

      {userTests === undefined && (
        <div className="animate-pulse my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {userTests && userTests.length === 0 && (
        <Empty message="You have no image tests" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-12 gap-8">
        {sortedTests?.map((test) => {
          return (
            <TestCard
              key={test._id}
              imageTest={test}
              deleteImageTest={
                user?.isAdmin
                  ? () => {
                      deleteTest({ testId: test._id });
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
