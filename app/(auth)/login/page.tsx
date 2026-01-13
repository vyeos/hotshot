"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";
import { TriangleAlert } from "lucide-react";
import { AnimeGithubIcon, AnimeGoogleIcon } from "@/components/AnimeIcons";
import Link from "next/link";
import { useState } from "react";
import z from "zod";

const page = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [errors, setErrors] = useState("");
  const { signIn } = useAuthActions();

  const handlePasswordLogin = async (formData: any) => {
    try {
      await signIn("password", {
        email: formData.email,
        password: formData.password,
        flow: "signIn",
      });
    } catch (error) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setErrors("Invalid email or password");
    }
  };

  const handleProviderLogin = (provider: "github" | "google") => {
    void signIn(provider);
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      handlePasswordLogin(value);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <div
        className={`w-full max-w-md space-y-8 bg-card border border-border rounded-xl shadow-lg p-8 ${isShaking && "animate-shake"} ${errors && "border-destructive"}`}
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Getting horny again huh!
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to the platform
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleProviderLogin("github")}
            className="flex items-center justify-center gap-2 w-full"
          >
            <AnimeGithubIcon className="w-5 h-5" />
            <span>GitHub</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleProviderLogin("google")}
            className="flex items-center justify-center gap-2 w-full"
          >
            <AnimeGoogleIcon className="w-5 h-5" />
            <span>Google</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="email"
            validators={{
              onChange: z.string().email(),
            }}
            children={(field) => (
              <div className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  id={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setErrors("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            )}
          />

          <div className="space-y-2">
            <form.Field
              name="password"
              validators={{
                onChange: z.string(),
              }}
              children={(field) => (
                <>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="your secret"
                    id={field.name}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setErrors("");
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </>
              )}
            />
          </div>

          {errors && (
            <div className="animate-in slide-in-from-left-2 fade-in duration-300 flex items-center gap-3 rounded-lg bg-destructive/15 p-4 text-destructive">
              <TriangleAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{errors}</p>
            </div>
          )}

          <Button
            type="submit"
            className={`w-full font-semibold ${errors && "border border-destructive"}`}
            size="lg"
          >
            Back to business
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Become a fan of the website?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
