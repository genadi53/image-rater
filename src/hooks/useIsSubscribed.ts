import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useIsSubscribed = () => {
  const user = useQuery(api.users.getLoggedUser);
  const isSubscribed = user && (user.endsOn ?? 0) > Date.now();
  return { isSubscribed };
};
