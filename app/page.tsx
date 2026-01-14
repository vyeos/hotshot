"use client";

import Drops from "@/components/Drops";
import { useCurrentUser } from "@/components/UserProvider";

export default function Page() {
  const { user } = useCurrentUser();

  return (
    <>
      <Drops />
    </>
  );
}
