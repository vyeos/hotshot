import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export const useCurrentUser = () => {
    const user = useQuery(api.users.currentUser);
    return user
};
