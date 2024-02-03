"use client";

import Comments from "@/components/Comments";
import { ImageTest } from "@/components/TestImage";
import { useConvexAuth, useQuery } from "convex/react";
import { shuffle } from "lodash";
import { useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface ImagesPageProps {
  params: {
    id: string;
  };
}

const ImagesPage = ({ params }: ImagesPageProps) => {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.getLoggedUser,
    !isAuthenticated ? "skip" : undefined
  );

  const imageTest = useQuery(api.images.getImageTestById, {
    testId: params.id as Id<"images">,
  });
  const images = useRef<string[] | null>(null);

  if (!imageTest) {
    return <div>Loading...</div>;
  }

  if (!images.current || images.current.length === 0) {
    images.current = shuffle([imageTest.imageA, imageTest.imageB]);
  }

  const [firstImageId, secondImageId] = images.current;

  const hasVoted: boolean = user ? imageTest.voteIds.includes(user._id) : false;

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
