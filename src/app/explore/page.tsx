"use client";

import {
  useConvexAuth,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { api } from "../../../convex/_generated/api";
import TestCard from "@/components/TestCard";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/SkeletonCard";
import Empty from "@/components/Empty";

const ExplorePage = () => {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.getLoggedUser,
    !isAuthenticated ? "skip" : undefined
  );

  const deleteTest = useMutation(api.images.deleteImageTest);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.images.getLatestImageTests,
    {},
    { initialNumItems: 10 }
  );

  if (isLoading || !results) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-12">
      <h1 className="text-center text-4xl font-bold mb-12">
        Review The Community Tests
      </h1>

      {isLoading && (
        <div className="animate-pulse my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-40">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <Empty message="No tests to display" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-12 gap-8">
        {results?.map((test) => {
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

      <Button
        className="w-full mb-12"
        disabled={status !== "CanLoadMore"}
        onClick={() => {
          loadMore(10);
        }}
      >
        Load More
      </Button>
    </div>
  );
};

export default ExplorePage;
