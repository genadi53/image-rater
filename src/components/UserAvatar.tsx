import { getInitials } from "@/lib/nameInitals";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface UserAvatarProps {
  userId?: string | undefined;
  imageUrl?: string | undefined;
  name?: string | undefined;
  styles?: string | undefined;
}

const UserAvatar = ({ imageUrl, name, userId, styles }: UserAvatarProps) => {
  return (
    <Link href={userId ? `/profile/${userId}` : "/dashboard"}>
      <Avatar className={cn(styles ?? "")}>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
