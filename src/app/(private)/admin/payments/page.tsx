"use client";

import { useGetAllPayments } from "@/hooks";
import type { PaymentStatus } from "@/types";
import { useState } from "react";

export default function AllPaymentsPage() {
   const [page, setPage] = useState(1);
   const [limit] = useState(10);
   const [status, setStatus] = useState<PaymentStatus | "">("");
   const [studentId, setStudentId] = useState("");

   const { data, isLoading, isError } = useGetAllPayments({
      page,
      limit,
      status: status || undefined,
      studentId: studentId || undefined,
   });

   const payments = data?.data ?? [];
   const meta = data?.meta;

   const statusColor = (s: string) => {
      if (s === "PAID") return "text-green-600";
      if (s === "FAILED") return "text-red-600";
      return "text-yellow-600";
   };

   return (
      <div className="p-6">
         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">All Payments</h1>

            <div className="flex gap-2">
               <input
                  type="text"
                  value={studentId}
                  onChange={(e) => {
                     setPage(1);
                     setStudentId(e.target.value);
                  }}
                  placeholder="Filter by Student ID"
                  className="w-56 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               />
               <select
                  value={status}
                  onChange={(e) => {
                     setPage(1);
                     setStatus(e.target.value as PaymentStatus | "");
                  }}
                  className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
               </select>
            </div>
         </div>

         {isLoading && <p className="text-sm text-muted-foreground">Loading payments...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load payments.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Student</th>
                        <th className="px-4 py-3 font-medium">Student ID</th>
                        <th className="px-4 py-3 font-medium">Semester</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Trx ID</th>
                        <th className="px-4 py-3 font-medium">Paid At</th>
                     </tr>
                  </thead>
                  <tbody>
                     {payments.length === 0 && (
                        <tr>
                           <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                              No payments found.
                           </td>
                        </tr>
                     )}
                     {payments.map((payment) => (
                        <tr key={payment.id} className="border-t">
                           <td className="px-4 py-3">{payment.student.name}</td>
                           <td className="px-4 py-3">{payment.student.studentId}</td>
                           <td className="px-4 py-3">{payment.semester.name}</td>
                           <td className="px-4 py-3">৳{payment.amount}</td>
                           <td className={`px-4 py-3 font-medium ${statusColor(payment.status)}`}>
                              {payment.status}
                           </td>
                           <td className="px-4 py-3">{payment.bkashTrxId ?? "-"}</td>
                           <td className="px-4 py-3">
                              {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "-"}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
               <p className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages} ({meta.total} total)
               </p>
               <div className="flex gap-2">
                  <button
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page <= 1}
                     className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                     Previous
                  </button>
                  <button
                     onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                     disabled={page >= meta.totalPages}
                     className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                     Next
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
