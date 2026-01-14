"use client";

import { notFound } from "next/navigation";
import { useCurrentUser } from "@/components/UserProvider";

const page = () => {
  const { user } = useCurrentUser();
  if (
    user?.email != process.env.NEXT_PUBLIC_SENPAI_EMAIL ||
    user?.username != process.env.NEXT_PUBLIC_SENAPI_USERNAME
  ) {
    notFound();
  }

  return <div></div>;
};

export default page;
