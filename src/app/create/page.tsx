"use client";

import { useMutation } from "convex/react";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/cn";
import { getImageUrl } from "@/lib/getImageUrl";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import UpgradeButton from "@/components/UpagradeButton";
import { ConvexError } from "convex/values";

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
};

const CreatePage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { isLoaded, session } = useSession();

  const createImageTest = useMutation(api.images.createImageTest);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [imageA, setImageA] = useState<string>("");
  const [imageB, setImageB] = useState<string>("");
  const [errors, setErrors] = useState(defaultErrorState);

  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold mb-8">Create a Image Test</h1>
      <p className="text-xl max-w-md mb-8">
        Create page Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Nobis sed tenetur repudiandae rem quis doloribus, ducimus cumque
        explicabo. Placeat quo modi asperiores cum quam pariatur blanditiis,
        odit dolorum. Dolores, blanditiis.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get("title") as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "please fill in this required field",
            };
          }

          if (!imageA) {
            newErrors = {
              ...newErrors,
              imageA: "please fill in this required field",
            };
          }

          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: "please fill in this required field",
            };
          }

          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);

          if (hasErrors) {
            return toast({
              title: "Form Errors",
              description: "Please fill fields on the page",
              variant: "destructive",
            });
          }

          try {
            const imageTestId = await createImageTest({
              imageA,
              imageB,
              title,
              userId: session?.user.id ?? "",
              name: session?.user.fullName ?? undefined,
              profileImage: session?.user.imageUrl,
            });

            router.push(`/images/${imageTestId}`);
          } catch (error) {
            if (
              error instanceof ConvexError &&
              error.message.includes("subscribe")
            ) {
              return toast({
                title: "You ran out of a free credits",
                description: (
                  <div className="flex flex-row items-center justify-between">
                    <p className="mr-2">
                      You must upgrade in order to create more thumbnail tests
                    </p>
                    <div className="-mt-8">
                      <UpgradeButton />
                    </div>
                  </div>
                ),
                variant: "destructive",
              });
            } else {
              return toast({
                title: "Something went wrong.",
                description: (
                  <div className="flex flex-row items-center justify-between">
                    <p className="mr-2">
                      Your test was not created. Please try again.
                    </p>
                    <div className="-mt-8">
                      <UpgradeButton />
                    </div>
                  </div>
                ),
                variant: "destructive",
              });
            }
          }
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Your Test Title</Label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="Label your test to make it easier to manage later"
            className={cn({
              border: errors.title,
              "border-red-500": errors.title,
            })}
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={cn("flex flex-col gap-4 rounded p-2", {
              border: errors.imageA,
              "border-red-500": errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image A</h2>

            {imageA && (
              <Image
                className="w-full"
                width="600"
                height="800"
                alt="image test a"
                src={getImageUrl(imageA)}
              />
            )}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageA((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />

            {errors.imageA && (
              <div className="text-red-500">{errors.imageA}</div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div
              className={cn("flex flex-col gap-4 rounded p-2", {
                border: errors.imageB,
                "border-red-500": errors.imageB,
              })}
            >
              <h2 className="text-2xl font-bold">Test Image B</h2>

              {imageB && (
                <Image
                  className="w-full"
                  width="600"
                  height="800"
                  alt="image test b"
                  src={getImageUrl(imageB)}
                />
              )}

              <UploadButton
                uploadUrl={generateUploadUrl}
                fileTypes={["image/*"]}
                onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                  setImageB((uploaded[0].response as any).storageId);
                }}
                onUploadError={(error: unknown) => {
                  alert(`ERROR! ${error}`);
                }}
              />

              {errors.imageB && (
                <div className="text-red-500">{errors.imageB}</div>
              )}
            </div>
          </div>
        </div>

        <Button>Create Thumbnail Test</Button>
      </form>
    </div>
  );
};

export default CreatePage;
