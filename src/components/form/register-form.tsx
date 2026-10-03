"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegistration } from "@/hooks";
import { studentRegistrationSchema } from "@/validation";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

export function RegisterForm() {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   type StudentDefaultValues = z.infer<typeof studentRegistrationSchema>;

   const defaultValues: StudentDefaultValues = {
      name: "",
      email: "",
      studentId: "",
      password: "",
      confirmPassword: "",
   };

   const { mutate: registration, isPending: registrationPending } = useRegistration();

   const form = useForm({
      defaultValues,
      validators: {
         onSubmit: studentRegistrationSchema,
      },
      onSubmit: ({ value }) => {
         const registrationData = {
            name: value.name,
            email: value.email,
            password: value.password,
            student: {
               studentId: value.studentId || undefined,
            },
         };

         registration(registrationData, {
            onSuccess: (res) => {
               if (!res.success) {
                  toast.add({
                     title: "Server Failure",
                     description: "Something went wrong. Please try again",
                     type: "error",
                  });
                  return;
               }

               toast.add({
                  title: "Registration Successful",
                  description: "Please verify your account",
                  type: "success",
               });

               const params = new URLSearchParams({
                  email: registrationData.email,
               });

               router.push(`/register/verify-account?${params.toString()}`);
            },
            onError: (err) => {
               toast.add({
                  title: "Registration failure",
                  description: err.message || "Something went wrong. Please try again",
                  type: "error",
               });
            },
         });
      },
   });

   return (
      <div className="flex flex-col gap-6">
         <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create a student account</h1>
            <p className="text-sm text-muted-foreground">
               Enter your details below to create your account
            </p>
         </div>

         <form
            onSubmit={(e) => {
               e.preventDefault();
               e.stopPropagation();
               form.handleSubmit();
            }}
         >
            <FieldGroup>
               <form.Field name="name">
                  {(field) => {
                     const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                     return (
                        <Field data-invalid={isInvalid}>
                           <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                           <Input
                              id={field.name}
                              name={field.name}
                              type="text"
                              placeholder="John Doe"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              aria-invalid={isInvalid}
                              autoComplete="name"
                           />
                           {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                     );
                  }}
               </form.Field>

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
                              placeholder="m@example.com"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              aria-invalid={isInvalid}
                              autoComplete="email"
                           />
                           {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                     );
                  }}
               </form.Field>

               <form.Field name="studentId">
                  {(field) => {
                     const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                     return (
                        <Field data-invalid={isInvalid}>
                           <FieldLabel htmlFor={field.name}>Student ID (Optional)</FieldLabel>
                           <Input
                              id={field.name}
                              name={field.name}
                              type="text"
                              placeholder="Enter your student ID"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
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
                                 placeholder="*********"
                                 value={field.state.value}
                                 onBlur={field.handleBlur}
                                 onChange={(e) => field.handleChange(e.target.value)}
                                 aria-invalid={isInvalid}
                                 className="pr-10"
                                 autoComplete="new-password"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                 aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                 {showPassword ? (
                                    <EyeOff className="size-4" />
                                 ) : (
                                    <Eye className="size-4" />
                                 )}
                              </button>
                           </div>
                           {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                     );
                  }}
               </form.Field>

               <form.Field name="confirmPassword">
                  {(field) => {
                     const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                     return (
                        <Field data-invalid={isInvalid}>
                           <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                           <div className="relative">
                              <Input
                                 id={field.name}
                                 name={field.name}
                                 type={showConfirmPassword ? "text" : "password"}
                                 placeholder="*********"
                                 value={field.state.value}
                                 onBlur={field.handleBlur}
                                 onChange={(e) => field.handleChange(e.target.value)}
                                 aria-invalid={isInvalid}
                                 className="pr-10"
                                 autoComplete="new-password"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                 aria-label={
                                    showConfirmPassword ? "Hide password" : "Show password"
                                 }
                              >
                                 {showConfirmPassword ? (
                                    <EyeOff className="size-4" />
                                 ) : (
                                    <Eye className="size-4" />
                                 )}
                              </button>
                           </div>
                           {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                     );
                  }}
               </form.Field>

               <Button disabled={registrationPending} type="submit">
                  {registrationPending ? (
                     <>
                        <Spinner /> Submitting
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
            Already have an account?{" "}
            <Link
               href="/login"
               className="font-medium underline underline-offset-4 hover:text-primary"
            >
               Login
            </Link>
         </div>
      </div>
   );
}
