"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSinglePayment } from "@/hooks";

function PaymentResult() {
   const searchParams = useSearchParams();
   const queryClient = useQueryClient();

   const paymentId = searchParams.get("paymentId") ?? "";
   const errorMessage = searchParams.get("message");

   const { data: payment, isLoading, isError } = useGetSinglePayment(paymentId);

   useEffect(() => {
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
   }, [queryClient]);

   if (!paymentId) {
      return (
         <ResultCard
            tone="error"
            title="Payment could not be completed"
            message={errorMessage ?? "Something went wrong. Please try again."}
         />
      );
   }

   if (isLoading) {
      return <p className="p-6 text-sm text-muted-foreground">Checking payment status...</p>;
   }

   if (isError || !payment) {
      return (
         <ResultCard
            tone="error"
            title="Could not load payment"
            message="Please check My Payments to see the status."
         />
      );
   }

   const details = (
      <dl className="mt-4 divide-y text-left text-sm">
         <Row label="Invoice" value={payment.merchantInvoiceNumber} />
         <Row label="Semester" value={payment.semester.name} />
         <Row label="Amount" value={`৳${payment.amount}`} />
         {payment.bkashTrxId && <Row label="bKash TrxID" value={payment.bkashTrxId} />}
         {payment.paidAt && (
            <Row label="Paid At" value={new Date(payment.paidAt).toLocaleString()} />
         )}
      </dl>
   );

   if (payment.status === "PAID") {
      return (
         <ResultCard tone="success" title="Payment Successful" message="Your fee has been paid.">
            {details}
         </ResultCard>
      );
   }

   if (payment.status === "FAILED") {
      return (
         <ResultCard
            tone="error"
            title="Payment Failed"
            message="Payment was cancelled or failed. No money was deducted."
         >
            {details}
         </ResultCard>
      );
   }

   return (
      <ResultCard
         tone="pending"
         title="Payment Pending"
         message="We are still waiting for confirmation. Check My Payments in a moment."
      >
         {details}
      </ResultCard>
   );
}

function Row({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex justify-between gap-4 py-2">
         <dt className="text-muted-foreground">{label}</dt>
         <dd className="font-medium">{value}</dd>
      </div>
   );
}

function ResultCard({
   tone,
   title,
   message,
   children,
}: {
   tone: "success" | "error" | "pending";
   title: string;
   message: string;
   children?: React.ReactNode;
}) {
   const color =
      tone === "success" ? "text-green-600" : tone === "error" ? "text-red-600" : "text-yellow-600";

   const icon = tone === "success" ? "✓" : tone === "error" ? "✕" : "…";

   return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
         <div className="w-full max-w-md rounded-md border p-6 text-center">
            <div className={`mx-auto mb-3 text-4xl font-bold ${color}`}>{icon}</div>
            <h1 className={`text-xl font-semibold ${color}`}>{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            {children}
            <div className="mt-6 flex justify-center gap-2">
               <Link
                  href="/student/payments"
                  className="rounded-md bg-primary px-4 py-2 text-sm text-white"
               >
                  My Payments
               </Link>
               <Link href="/student" className="rounded-md border px-4 py-2 text-sm">
                  Dashboard
               </Link>
            </div>
         </div>
      </div>
   );
}

export default function PaymentResultPage() {
   return (
      <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading...</p>}>
         <PaymentResult />
      </Suspense>
   );
}
