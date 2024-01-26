"use client";

import { useQueries, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";

interface ImagesPageProps {
  params: {
    id: string;
  };
}

const ImagesPage = ({ params }: ImagesPageProps) => {
  const imageTest = useQuery(api.images.getImageTestById, {
    testId: params.id as Id<"images">,
  });
  return (
    <div className="mt-16">
      <div className="grid">
        <div>
          <h2 className="text-2xl font-bold">Test Image A</h2>
          {imageTest?.imageA && (
            <Image
              width="600"
              height="800"
              alt="image test a"
              src={getImageUrl(imageTest.imageA)}
            />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">Test Image B</h2>
          {imageTest?.imageB && (
            <Image
              width="600"
              height="800"
              alt="image test a"
              src={getImageUrl(imageTest.imageB)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesPage;
