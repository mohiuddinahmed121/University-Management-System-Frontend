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
import { useVerifyAccount } from "@/hooks";
import { toast } from "@/components/ui/toast";

const RESEND_COOLDOWN = 120;

export default function VerifyAccountForm({
   mode = "student",
}: {
   mode: "instructor" | "student";
}) {
   const searchParams = useSearchParams();
   const router = useRouter();

   const [otp, setOtp] = useState("");
   const [isInvalid, setIsInvalid] = useState(false);
   const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

   const { mutate: verifyAccount } = useVerifyAccount();

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

      verifyAccount(
         { email, otp },
         {
            onSuccess: (res) => {
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

               toast.add({
                  title: "Verification Successful",
                  description: "Welcome onboard",
                  type: "success",
               });
               router.push("/");
            },
            onError: (err) => {
               toast.add({
                  title: "Verification failure",
                  description: err.message || "Something went wrong. Please try again",
                  type: "error",
               });
            },
         },
      );
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
