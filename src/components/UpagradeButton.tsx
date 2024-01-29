import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface UpgradeButtonProps {}

const UpgradeButton = ({}: UpgradeButtonProps) => {
  const router = useRouter();
  const pay = useAction(api.stripe.pay);

  const handleProfileUpgrade = async () => {
    const url = await pay();
    router.push(url);
  };

  return (
    <Button variant={"outline"} onClick={handleProfileUpgrade}>
      Upgrade
    </Button>
  );
};

export default UpgradeButton;
