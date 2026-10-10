"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed } from "lucide-react";

import { getMe } from "@/api";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";
import type { UserRole } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";

const roleRoutes: Record<UserRole, string> = {
   ADMIN: "/admin",
   INSTRUCTOR: "/instructor",
   STUDENT: "/student",
};

export default function LoginForm() {
   const [showPassword, setShowPassword] = useState(false);
   const router = useRouter();
   const queryClient = useQueryClient();

   const { mutate: login, isPending: loginPending } = useLogin();

   const form = useForm({
      defaultValues: {
         email: "",
         password: "",
      },
      validators: {
         onSubmit: loginSchema,
      },
      onSubmit: ({ value }) => {
         login(
            {
               email: value.email,
               password: value.password,
            },
            {
               onSuccess: async () => {
                  try {
                     // Backend sets the auth cookies during login.
                     // Fetch the authenticated user's role from /auth/me.
                     const response = await getMe();

                     queryClient.setQueryData(["user"], response);

                     const role = response.data.role as UserRole;
                     const destination = roleRoutes[role];

                     if (!destination) {
                        throw new Error("Your account has an unsupported role.");
                     }

                     toast.add({
                        title: "Login Success",
                        description: "Welcome back",
                        type: "success",
                     });

                     router.replace(destination);
                  } catch (error) {
                     toast.add({
                        title: "Could not load your account",
                        description:
                           error instanceof Error ? error.message : "Please try logging in again.",
                        type: "error",
                     });
                  }
               },
               onError: (err) => {
                  toast.add({
                     title: "Authorization failure",
                     description: err.message || "Something went wrong. Please try again.",
                     type: "error",
                  });
               },
            },
         );
      },
   });

   return (
      <div className="flex flex-col gap-5">
         {" "}
         <div className="flex flex-col items-center gap-2 text-center">
            {" "}
            <h1 className="text-2xl font-bold tracking-tight">Login to your account </h1>{" "}
            <p className="text-balance text-sm text-muted-foreground">
               Enter your email below to login to your account{" "}
            </p>{" "}
         </div>
         <form
            onSubmit={(event) => {
               event.preventDefault();
               form.handleSubmit();
            }}
         >
            <FieldGroup>
               <form.Field name="email">
                  {(field) => {
                     const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                     return (
                        <Field data-invalid={isInvalid}>
                           <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                           <Input
                              id={field.name}
                              name={field.name}
                              type="email"
                              value={field.state.value}
                              onChange={(event) => field.handleChange(event.target.value)}
                              onBlur={field.handleBlur}
                              autoComplete="email"
                              aria-invalid={isInvalid}
                           />
                           {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                     );
                  }}
               </form.Field>

               <form.Field name="password">
                  {(field) => {
                     const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                     return (
                        <Field data-invalid={isInvalid}>
                           <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                           <div className="relative">
                              <Input
                                 id={field.name}
                                 name={field.name}
                                 type={showPassword ? "text" : "password"}
                                 value={field.state.value}
                                 onChange={(event) => field.handleChange(event.target.value)}
                                 onBlur={field.handleBlur}
                                 autoComplete="current-password"
                                 aria-invalid={isInvalid}
                              />
                              <button
                                 className="absolute right-3 top-1/2 -translate-y-1/2"
                                 type="button"
                                 onClick={() => setShowPassword((previous) => !previous)}
                                 aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                 {showPassword ? (
                                    <Eye className="size-4" />
                                 ) : (
                                    <EyeClosed className="size-4" />
                                 )}
                              </button>
                           </div>
                           {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                     );
                  }}
               </form.Field>

               <Button disabled={loginPending} type="submit">
                  {loginPending ? (
                     <>
                        <Spinner />
                        Submitting
                     </>
                  ) : (
                     "Submit"
                  )}
               </Button>
            </FieldGroup>
         </form>
         <FieldSeparator>Or continue with</FieldSeparator>
         <GoogleLoginComponent />
         <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
               href="/register"
               className="font-medium underline underline-offset-4 hover:text-primary"
            >
               Register
            </Link>
         </div>
      </div>
   );
}
