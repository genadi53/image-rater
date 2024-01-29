"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "./ui/use-toast";
import { formatDistance } from "date-fns";

interface CommentsProps {
  imageTest: Doc<"images">;
}

const formSchema = z.object({
  text: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const Comments = ({ imageTest }: CommentsProps) => {
  const createComment = useMutation(api.images.addComment);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    createComment({
      testId: imageTest._id,
      text: data.text,
    })
      .then(() => {
        form.reset();
        return toast({
          title: "Comment was Added!",
          description: `Thanks for leaving your feedback.`,
        });
      })
      .catch((error) => {
        console.error(error);
        return toast({
          title: "Something went wrong!",
          description: `You comment was nod added! Please try again!`,
          variant: "default",
        });
      });
  };

  return (
    <div>
      <h2 className="text-4xl font-bold text-center my-8">Comments</h2>

      <div className="mx-auto w-full max-w-lg p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave a comment with your feedback.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      <div className="space-y-8 mx-auto w-full max-w-xl p-4 mt-12">
        {imageTest.comments?.map((comment, idx) => {
          return (
            <div
              className="border-2 p-4 rounded-xl"
              key={`${comment.createdAt}-${idx}`}
            >
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.profileImage} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>
                    {comment.name}{" "}
                    <span className="ml-1 text-sm text-muted-foreground">
                      {formatDistance(new Date(comment.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                  <div className="text-base">{comment.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
