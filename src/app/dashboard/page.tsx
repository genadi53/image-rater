"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistance, subDays } from "date-fns";
import TestCard from "@/components/TestCard";

const DashboardPage = () => {
  const userTests = useQuery(api.images.getImageTestByUser);
  const sortedTests = [...(userTests ?? [])].reverse();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12 gap-8">
      {sortedTests?.map((test) => {
        return <TestCard key={test._id} {...test} />;
      })}
    </div>
  );
};

export default DashboardPage;
