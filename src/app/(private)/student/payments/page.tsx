"use client";

import { useCreatePayment, useGetMyPayments } from "@/hooks";
import { useState } from "react";

export default function MyPaymentsPage() {
   const { data, isLoading, isError } = useGetMyPayments();
   const { mutate: pay, isPending } = useCreatePayment();

   const [semesterId, setSemesterId] = useState("");
   const [amount, setAmount] = useState("");

   const payments = data?.data ?? [];

   const handlePay = (e: React.FormEvent) => {
      e.preventDefault();
      if (!semesterId || !amount) return;

      pay(
         { semesterId, amount: Number(amount) },
         {
            onSuccess: (res) => {
               window.location.href = res.bkashURL;
            },
         },
      );
   };

   const statusColor = (status: string) => {
      if (status === "PAID") return "text-green-600";
      if (status === "FAILED") return "text-red-600";
      return "text-yellow-600";
   };

   return (
      <div className="p-6">
         <h1 className="mb-6 text-2xl font-semibold">My Payments</h1>

         <form
            onSubmit={handlePay}
            className="mb-6 flex flex-wrap items-end gap-3 rounded-md border p-4"
         >
            <div>
               <label className="mb-1 block text-sm text-muted-foreground">Semester ID</label>
               <input
                  type="text"
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                  placeholder="Semester ID"
                  className="w-56 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               />
            </div>
            <div>
               <label className="mb-1 block text-sm text-muted-foreground">Amount (BDT)</label>
               <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-40 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               />
            </div>
            <button
               type="submit"
               disabled={isPending}
               className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
            >
               {isPending ? "Redirecting..." : "Pay with bKash"}
            </button>
         </form>

         {isLoading && <p className="text-sm text-muted-foreground">Loading payments...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load payments.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Invoice</th>
                        <th className="px-4 py-3 font-medium">Semester</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Paid At</th>
                     </tr>
                  </thead>
                  <tbody>
                     {payments.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                              No payments yet.
                           </td>
                        </tr>
                     )}
                     {payments.map((payment) => (
                        <tr key={payment.id} className="border-t">
                           <td className="px-4 py-3">{payment.merchantInvoiceNumber}</td>
                           <td className="px-4 py-3">{payment.semester.name}</td>
                           <td className="px-4 py-3">৳{payment.amount}</td>
                           <td className={`px-4 py-3 font-medium ${statusColor(payment.status)}`}>
                              {payment.status}
                           </td>
                           <td className="px-4 py-3">
                              {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "-"}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}
