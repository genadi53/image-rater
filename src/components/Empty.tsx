import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const Empty = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Image
        className="rounded-lg bg-white p-12"
        src="/void.png"
        alt="no found icon"
        width="400"
        height="400"
        aria-hidden={true}
      />
      <div className="text-2xl font-bold">{message}</div>

      <Button asChild>
        <Link href="/create">Create a Image Test</Link>
      </Button>
    </div>
  );
};

export default Empty;
