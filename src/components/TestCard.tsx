"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "@clerk/nextjs";
import { getInitials } from "@/lib/nameInitals";
import { TrashIcon } from "lucide-react";

interface TestCardProps {
  imageTest: Doc<"images">;
  deleteImageTest?: () => void | undefined;
}

const TestCard = ({ imageTest, deleteImageTest }: TestCardProps) => {
  const { session } = useSession();

  function hasVoted(voteIds: string[] | undefined) {
    if (!voteIds || voteIds.length === 0) return false;
    if (!session || !session.user) return false;
    return imageTest.voteIds.includes(session.user.id);
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="relative">
          {deleteImageTest && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="absolute right-1.5 top-1.5"
                  variant={"destructive"}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the test and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteImageTest();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
        <h2 className="text-center text-xl font-semibold mb-2">
          {imageTest.title}
        </h2>
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={imageTest.profileImage} />
            <AvatarFallback>{getInitials(imageTest.name)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p>{imageTest.name}</p>
            <p>
              {formatDistance(new Date(imageTest._creationTime), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <div className="flex">
          <p className="ml-auto mr-2">
            Votes: {imageTest.votesA + imageTest.votesB}
          </p>
        </div>
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
