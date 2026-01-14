"use client";

import { useCurrentUser } from "@/components/UserProvider";

const page = () => {
  const { user } = useCurrentUser();
  if (
    user?.email != process.env.NEXT_PUBLIC_SENPAI_EMAIL ||
    user?.username != process.env.NEXT_PUBLIC_SENAPI_USERNAME
  )
    // use 404 here
    return <p>No business here</p>;

  return <div></div>;
};

export default page;
