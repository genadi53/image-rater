"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";
import { shuffle } from "lodash";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";

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

  if (!imageTest || !session) {
    return <div>Loading...</div>;
  }

  const images = shuffle([imageTest?.imageA, imageTest?.imageB]);
  const [firstImageId, secondImageId] = images;

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
            <div className="text-lg">{getVotesFor(firstImageId)}</div>
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
            <div className="text-lg">{getVotesFor(secondImageId)}</div>
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
    </div>
  );
};

export default ImagesPage;
