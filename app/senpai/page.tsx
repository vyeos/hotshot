"use client";

import { useCurrentUser } from "@/components/UserProvider";


const page = () => {
  const user = useCurrentUser();
  console.log(user);
  return <div></div>;
};

export default page;
