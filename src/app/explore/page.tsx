"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import TestCard from "@/components/TestCard";
import { Button } from "@/components/ui/button";

const ExplorePage = () => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.images.getLatestImageTests,
    {},
    { initialNumItems: 10 }
  );

  if (isLoading || !results) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-12 gap-8">
        {results?.map((test) => {
          return <TestCard key={test._id} imageTest={test} />;
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
