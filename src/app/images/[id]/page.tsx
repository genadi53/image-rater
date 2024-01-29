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

interface ImagesPageProps {
  params: {
    id: string;
  };
}

const ImagesPage = ({ params }: ImagesPageProps) => {
  const getImageTestByUser = useQuery(api.images.getImageTestByUser);

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
    <div className="mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex items-center flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            Test Image A
          </h2>

          <div className="relative w-[400px] h-[400px]">
            <Image
              fill
              alt="image test a"
              className="object-center object-cover lg:w-full"
              src={getImageUrl(firstImageId)}
            />
          </div>

          {hasVoted ? (
            <>
              <Progress
                value={getVotePersentage(firstImageId)}
                className="w-full"
              />
              <div className="text-lg">{getVotesFor(firstImageId)} Votes</div>
            </>
          ) : (
            <Button
              onClick={() => {
                vote({
                  testId: params.id as Id<"images">,
                  imageId: firstImageId,
                });
              }}
              size="lg"
              className="w-fit"
            >
              Vote A
            </Button>
          )}
        </div>

        <div className="flex items-center flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            Test Image B
          </h2>
          <div className="relative w-[400px] h-[400px]">
            <Image
              fill
              alt="image test b"
              className="object-center object-cover lg:w-full"
              src={getImageUrl(secondImageId)}
            />
          </div>
          {hasVoted ? (
            <>
              <Progress
                value={getVotePersentage(secondImageId)}
                className="w-full"
              />
              <div className="text-lg">{getVotesFor(secondImageId)} Votes</div>
            </>
          ) : (
            <Button
              onClick={() => {
                vote({
                  testId: params.id as Id<"images">,
                  imageId: secondImageId,
                });
              }}
              size="lg"
              className="w-fit"
            >
              Vote B
            </Button>
          )}
        </div>
      </div>

      <Comments imageTest={imageTest} />
    </div>
  );
};

export default ImagesPage;
