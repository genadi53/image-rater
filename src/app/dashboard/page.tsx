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

const DashboardPage = () => {
  const userTests = useQuery(api.images.getImageTestByUser);
  const sortedTests = [...(userTests ?? [])].reverse();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12 gap-8">
      {userTests?.map((test) => {
        return (
          <Card key={test._id}>
            <CardHeader>
              <CardTitle>
                <Image
                  src={
                    test.votesA >= test.votesB
                      ? getImageUrl(test.imageA)
                      : getImageUrl(test.imageB)
                  }
                  alt="image preview"
                  width={400}
                  height={400}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <p>{test.title}</p>
              <p>
                {formatDistance(new Date(test._creationTime), new Date(), {
                  addSuffix: true,
                })}
              </p>
              <p>Votes: {test.votesA + test.votesB}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/images/${test._id}`}>View Results</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardPage;
