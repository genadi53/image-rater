"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";
import { shuffle } from "lodash";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";
import Comments from "@/components/Comments";
import { ImageTest } from "@/components/TestImage";

interface ImagesPageProps {
  params: {
    id: string;
  };
}

const ImagesPage = ({ params }: ImagesPageProps) => {
  const { session, isLoaded } = useSession();
  const imageTest = useQuery(api.images.getImageTestById, {
    testId: params.id as Id<"images">,
  });
  const vote = useMutation(api.images.voteOnImage);
  const images = useRef<string[] | null>(null);

  if (!imageTest || !session) {
    return <div>Loading...</div>;
  }

  if (!images.current || images.current.length === 0) {
    images.current = shuffle([imageTest.imageA, imageTest.imageB]);
  }

  const [firstImageId, secondImageId] = images.current;

  const hasVoted = imageTest.voteIds.includes(session.user.id);

  function getVotesFor(imageId: string) {
    if (imageId === imageTest?.imageA) {
      return imageTest.votesA;
    }

    if (imageId === imageTest?.imageB) {
      return imageTest.votesB;
    }
    return 0;
  }

  function getVotePersentage(imageId: string) {
    if (!imageTest) return 0;

    const totalVotes = imageTest.votesA + imageTest.votesB;
    if (totalVotes === 0) return 0;

    return Math.round((getVotesFor(imageId) / totalVotes) * 100);
  }

  return (
    <div className="mt-16 gap-12 flex flex-col">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <ImageTest
          imageTest={imageTest}
          hasVoted={hasVoted}
          imageId={firstImageId}
        />
        <ImageTest
          imageTest={imageTest}
          hasVoted={hasVoted}
          imageId={secondImageId}
        />
      </div>
      <Comments imageTest={imageTest} />
    </div>
  );
};

export default ImagesPage;
