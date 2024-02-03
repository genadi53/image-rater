import { getImageUrl } from "@/lib/getImageUrl";
import Image from "next/image";
import { Doc } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CheckCircleIcon, DotIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";

function getVotesFor(imageTest: Doc<"images">, imageId: string) {
  if (!imageTest) return 0;

  if (imageId === imageTest.imageA) {
    return imageTest.votesA;
  }

  if (imageId === imageTest.imageB) {
    return imageTest.votesB;
  }

  return 0;
}

function getVotePercent(imageTest: Doc<"images">, imageId: string) {
  if (!imageTest) return 0;

  const totalVotes = imageTest.votesA + imageTest.votesB;
  if (totalVotes === 0) return 0;

  return Math.round((getVotesFor(imageTest, imageId) / totalVotes) * 100);
}

export const ImageTest = ({
  imageId,
  imageTest,
  hasVoted,
}: {
  imageId: string;
  imageTest: Doc<"images">;
  hasVoted: boolean;
}) => {
  const vote = useMutation(api.images.voteOnImage);

  return (
    <div className="flex flex-col gap-4 mx-4">
      <Image
        width="600"
        height="600"
        alt="image test a"
        className="w-full"
        src={getImageUrl(imageId)}
      />

      <div className="flex gap-4">
        <UserAvatar
          imageUrl={imageTest.profileImage}
          name={imageTest.name}
          userId={imageTest.userId}
        />
        <div className="flex flex-col text-gray-300">
          <div className="font-bold mb-2 text-white">{imageTest.title}</div>
          <div className="flex gap-2 items-center">
            {imageTest.name} <CheckCircleIcon size={12} />
          </div>
          <div className="flex">
            <div>152K Views</div>
            <DotIcon />
            {formatDistance(new Date(imageTest._creationTime), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>

      {hasVoted ? (
        <>
          <Progress
            value={getVotePercent(imageTest, imageId)}
            className="w-full"
          />
          <div className="text-lg">{getVotesFor(imageTest, imageId)} votes</div>
        </>
      ) : (
        <Button
          onClick={() => {
            vote({
              testId: imageTest._id,
              imageId: imageId,
            });
          }}
          size="lg"
          className="w-1/2 mx-auto"
        >
          Vote
        </Button>
      )}
    </div>
  );
};
