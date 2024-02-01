import { getInitials } from "@/lib/nameInitals";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

interface UserAvatarProps {
  userId?: string | undefined;
  imageUrl?: string | undefined;
  name?: string | undefined;
}

const UserAvatar = ({ imageUrl, name, userId }: UserAvatarProps) => {
  return (
    <Link href={userId ? `/profile/${userId}` : "/dashboard"}>
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
