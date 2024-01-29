"use client";

import TestCard from "@/components/TestCard";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DashboardPage = () => {
  const userTests = useQuery(api.images.getImageTestByUser);
  const sortedTests = [...(userTests ?? [])].reverse();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12 gap-8">
      {sortedTests?.map((test) => {
        return <TestCard imageTest={test} key={test._id} />;
      })}
    </div>
  );
};

export default DashboardPage;
