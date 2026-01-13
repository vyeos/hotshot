import { Id } from "@/convex/_generated/dataModel";

export type User = {
    _id: Id<"users">;
    _creationTime: number;
    name?: string;
    image?: string;
    email: string;
    emailVerificationTime?: number;
    username?: string;
    daily_allowance: number;
    energy: number;
    isVirgin: boolean;
};
