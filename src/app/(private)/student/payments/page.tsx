"use client";

import { toast } from "@/components/ui/toast";
import {
   useCreatePayment,
   useGetAllSemesters,
   useGetMyPayments,
   useGetMyRegistrations,
} from "@/hooks";

export default function MyPaymentsPage() {
   const { data, isLoading, isError } = useGetMyPayments({ limit: 100 });
   const { data: semestersData } = useGetAllSemesters({ limit: 50 });
   const { data: registrationsData } = useGetMyRegistrations({ limit: 100 });
   const { mutate: pay, isPending, variables } = useCreatePayment();

   const payments = data?.data ?? [];
   const semesters = semestersData?.data ?? [];
   const registrations = registrationsData?.data ?? [];

   // Semesters that are already paid
   const paidSemesterIds = new Set(
      payments.filter((p) => p.status === "PAID").map((p) => p.semesterId),
   );

   // semester key -> number of registered courses
   const registeredCount = new Map<string, number>();
   for (const reg of registrations) {
      if (reg.status !== "REGISTERED") continue;

      const sem = reg.section.semester as { id?: string; name: string; year?: number };
      const key = sem.id ?? `${sem.name}-${sem.year}`;

      registeredCount.set(key, (registeredCount.get(key) ?? 0) + 1);
   }

   // Only registered AND unpaid semesters are payable
   const dues = semesters
      .map((s) => ({
         semester: s,
         courseCount: registeredCount.get(s.id) ?? registeredCount.get(`${s.name}-${s.year}`) ?? 0,
         isPaid: paidSemesterIds.has(s.id),
      }))
      .filter((d) => d.courseCount > 0 && !d.isPaid);

   const handlePay = (semesterId: string) => {
      pay(
         { semesterId },
         {
            onSuccess: (res) => {
               window.location.href = res.bkashURL;
            },
            onError: (err) => {
               toast.add({
                  title: "Payment failed",
                  description: err.message || "Could not start payment. Please try again.",
                  type: "error",
               });
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
      <div className="space-y-8 p-6">
         <h1 className="text-2xl font-semibold">My Payments</h1>

         <section>
            <h2 className="mb-3 text-lg font-medium">Payable Semesters</h2>

            {dues.length === 0 ? (
               <p className="rounded-md border px-4 py-6 text-center text-sm text-muted-foreground">
                  No pending fees. Register for courses to see your fees here.
               </p>
            ) : (
               <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-muted">
                        <tr>
                           <th className="px-4 py-3 font-medium">Semester</th>
                           <th className="px-4 py-3 font-medium">Registered Courses</th>
                           <th className="px-4 py-3 font-medium">Fee</th>
                           <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {dues.map(({ semester, courseCount }) => (
                           <tr key={semester.id} className="border-t">
                              <td className="px-4 py-3">
                                 {semester.name} {semester.year}
                              </td>
                              <td className="px-4 py-3">{courseCount}</td>
                              <td className="px-4 py-3">৳{semester.feeAmount}</td>
                              <td className="px-4 py-3">
                                 <button
                                    onClick={() => handlePay(semester.id)}
                                    disabled={isPending}
                                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-white disabled:opacity-50"
                                 >
                                    {isPending && variables?.semesterId === semester.id
                                       ? "Redirecting..."
                                       : "Pay with bKash"}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </section>

         <section>
            <h2 className="mb-3 text-lg font-medium">Payment History</h2>

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
                              <td
                                 colSpan={5}
                                 className="px-4 py-6 text-center text-muted-foreground"
                              >
                                 No payments yet.
                              </td>
                           </tr>
                        )}
                        {payments.map((payment) => (
                           <tr key={payment.id} className="border-t">
                              <td className="px-4 py-3">{payment.merchantInvoiceNumber}</td>
                              <td className="px-4 py-3">
                                 {payment.semester.name} {payment.semester.year}
                              </td>
                              <td className="px-4 py-3">৳{payment.amount}</td>
                              <td
                                 className={`px-4 py-3 font-medium ${statusColor(payment.status)}`}
                              >
                                 {payment.status}
                              </td>
                              <td className="px-4 py-3">
                                 {payment.paidAt
                                    ? new Date(payment.paidAt).toLocaleDateString()
                                    : "-"}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </section>
      </div>
   );
}
