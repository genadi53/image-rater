"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "@clerk/nextjs";

interface TestCardProps {
  imageTest: Doc<"images">;
}

const TestCard = ({ imageTest }: TestCardProps) => {
  const { session } = useSession();

  function hasVoted(voteIds: string[] | undefined) {
    if (!voteIds || voteIds.length === 0) return false;
    if (!session || !session.user) return false;
    return imageTest.voteIds.includes(session.user.id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Image
            src={
              imageTest.votesA >= imageTest.votesB
                ? getImageUrl(imageTest.imageA)
                : getImageUrl(imageTest.imageB)
            }
            alt="image preview"
            width={400}
            height={400}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={imageTest.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>{imageTest.title}</p>
        </div>

        <p>
          {formatDistance(new Date(imageTest._creationTime), new Date(), {
            addSuffix: true,
          })}
        </p>
        <p>Votes: {imageTest.votesA + imageTest.votesB}</p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={hasVoted(imageTest.voteIds) ? "outline" : "default"}
        >
          <Link href={`/images/${imageTest._id}`}>
            {hasVoted(imageTest.voteIds) ? "View Results" : "Vote Now"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
