"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useVerifyAccount, useVerifyInstructorEmail } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { getMe } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/types";

const RESEND_COOLDOWN = 120;

const roleRoutes: Record<UserRole, string> = {
   ADMIN: "/admin",
   INSTRUCTOR: "/instructor",
   STUDENT: "/student",
};

export default function VerifyAccountForm({
   mode = "student",
}: {
   mode: "instructor" | "student";
}) {
   const searchParams = useSearchParams();
   const router = useRouter();
   const queryClient = useQueryClient();

   const [otp, setOtp] = useState("");
   const [isInvalid, setIsInvalid] = useState(false);
   const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

   const { mutate: verifyStudentAccount } = useVerifyAccount();
   const { mutate: verifyInstructorAccount } = useVerifyInstructorEmail();

   const email = searchParams.get("email") || "";

   useEffect(() => {
      if (!email) {
         router.push("/");
      }
   }, [email, router]);

   useEffect(() => {
      if (resendTimer <= 0) {
         return;
      }

      const timer = setInterval(() => {
         setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
   }, [resendTimer]);

   const handleOTP = () => {
      if (otp.length !== 6) {
         setIsInvalid(true);
         return;
      }

      const onSuccess = async (res: { success: boolean }) => {
         if (!res.success) {
            toast.add({
               title: "Server Failure",
               description: "Something went wrong. Please try again",
               type: "error",
            });
            return;
         }

         if (mode === "instructor") {
            toast.add({
               title: "Verification Successful",
               description: "Your application is submitted. An admin will review it.",
               type: "success",
            });
            router.push("/");
            return;
         }

         try {
            // Backend sets the auth cookies during verify-email as well.
            // Fetch the authenticated user's role and redirect accordingly.
            const response = await getMe();

            queryClient.setQueryData(["user"], response);

            const role = response.data.role as UserRole;
            const destination = roleRoutes[role];

            if (!destination) {
               throw new Error("Your account has an unsupported role.");
            }

            toast.add({
               title: "Verification Successful",
               description: "Welcome onboard",
               type: "success",
            });

            router.replace(destination);
         } catch (error) {
            toast.add({
               title: "Could not load your account",
               description: error instanceof Error ? error.message : "Please try logging in again.",
               type: "error",
            });
            router.push("/login");
         }
      };

      const onError = (err: { message?: string }) => {
         toast.add({
            title: "Verification failure",
            description: err.message || "Something went wrong. Please try again",
            type: "error",
         });
      };

      if (mode === "instructor") {
         verifyInstructorAccount({ email, otp }, { onSuccess, onError });
      } else {
         verifyStudentAccount({ email, otp }, { onSuccess, onError });
      }
   };

   if (!email) {
      return null;
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Verify Account</CardTitle>
            <CardDescription>Please provide the OTP we sent to your email</CardDescription>
         </CardHeader>

         <CardContent>
            <form
               id="otp-form"
               onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOTP();
               }}
            >
               <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="otp">OTP</FieldLabel>
                  <InputOTP
                     maxLength={6}
                     onChange={(value) => {
                        setOtp(value);
                        if (isInvalid) {
                           setIsInvalid(false);
                        }
                     }}
                     value={otp}
                     autoComplete="off"
                     name="otp"
                     id="otp"
                     pattern={REGEXP_ONLY_DIGITS}
                  >
                     <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                     </InputOTPGroup>
                  </InputOTP>

                  {isInvalid && (
                     <FieldError errors={[{ message: "Invalid Code. Please try again" }]} />
                  )}

                  <FieldDescription>Resend in {resendTimer}</FieldDescription>
               </Field>
            </form>
         </CardContent>

         <CardFooter>
            <Button type="button" disabled={resendTimer > 0}>
               Resend
            </Button>
            <Button type="submit" form="otp-form">
               Submit
            </Button>
         </CardFooter>
      </Card>
   );
}
