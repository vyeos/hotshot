"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

function SetUsername() {
  const setUsernameMutation = useMutation(api.users.setUsername);
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      username: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await setUsernameMutation({ username: value.username });
        window.location.reload();
      } catch (e: any) {
        setError(e.message);
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="bg-card w-full max-w-md p-8 rounded-xl shadow-lg border border-border">
        <h2 className="text-2xl font-bold mb-4">Set your username</h2>
        <p className="text-muted-foreground mb-6">
          Choose a unique username to continue.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="username"
            children={(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Username"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Save Username
          </Button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const user = useCurrentUser();

  if (user === undefined) return null; // Loading

  if (user && !user.username) {
    return <SetUsername />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome, {user?.username}</h1>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  // Simple redirect for unauthenticated users for now, or show Landing
  return (
    <>
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-8">Hotshot</h1>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/login")}>Login</Button>
            <Button onClick={() => router.push("/signup")} variant="outline">Signup</Button>
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
