"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useCreateSemester, useGetAllSemesters, useUpdateSemesterStatus } from "@/hooks";
import type { SemesterStatus } from "@/types";
import Link from "next/link";
import { useState } from "react";

export default function AdminSemestersPage() {
   const [showForm, setShowForm] = useState(false);
   const [form, setForm] = useState({
      name: "SPRING",
      year: "",
      startDate: "",
      endDate: "",
      feeAmount: "",
   });

   const { data, isLoading } = useGetAllSemesters({ limit: 20 });
   const { mutate: createSemester, isPending: isCreating } = useCreateSemester();
   const { mutate: updateStatus } = useUpdateSemesterStatus();

   const semesters = data?.data ?? [];

   const handleCreate = () => {
      createSemester(
         {
            name: form.name as "SPRING" | "SUMMER" | "FALL",
            year: Number(form.year),
            startDate: form.startDate,
            endDate: form.endDate,
            feeAmount: Number(form.feeAmount),
         },
         {
            onSuccess: () => {
               toast.add({ title: "Created", description: "Semester created", type: "success" });
               setForm({ name: "SPRING", year: "", startDate: "", endDate: "", feeAmount: "" });
               setShowForm(false);
            },
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   const handleStatusChange = (semesterId: string, status: SemesterStatus) => {
      updateStatus(
         { semesterId, status },
         {
            onSuccess: () =>
               toast.add({ title: "Updated", description: "Status updated", type: "success" }),
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   return (
      <div className="space-y-4">
         <div className="flex justify-end">
            <Button onClick={() => setShowForm((prev) => !prev)}>
               {showForm ? "Cancel" : "+ New Semester"}
            </Button>
         </div>

         {showForm && (
            <div className="grid gap-3 rounded-md border p-4 sm:grid-cols-2">
               <Field>
                  <FieldLabel>Name</FieldLabel>
                  <select
                     value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })}
                     className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                     <option value="SPRING">Spring</option>
                     <option value="SUMMER">Summer</option>
                     <option value="FALL">Fall</option>
                  </select>
               </Field>
               <Field>
                  <FieldLabel>Year</FieldLabel>
                  <Input
                     type="number"
                     value={form.year}
                     onChange={(e) => setForm({ ...form, year: e.target.value })}
                     placeholder="2026"
                  />
               </Field>
               <Field>
                  <FieldLabel>Start Date</FieldLabel>
                  <Input
                     type="date"
                     value={form.startDate}
                     onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>End Date</FieldLabel>
                  <Input
                     type="date"
                     value={form.endDate}
                     onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Fee Amount</FieldLabel>
                  <Input
                     type="number"
                     value={form.feeAmount}
                     onChange={(e) => setForm({ ...form, feeAmount: e.target.value })}
                     placeholder="5000"
                  />
               </Field>
               <div className="sm:col-span-2">
                  <Button onClick={handleCreate} disabled={isCreating}>
                     {isCreating ? "Creating..." : "Create Semester"}
                  </Button>
               </div>
            </div>
         )}

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Semester</th>
                     <th className="p-3">Start</th>
                     <th className="p-3">End</th>
                     <th className="p-3">Fee</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading && (
                     <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                           Loading...
                        </td>
                     </tr>
                  )}

                  {!isLoading && semesters.length === 0 && (
                     <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                           No semesters found
                        </td>
                     </tr>
                  )}

                  {semesters.map((semester) => (
                     <tr key={semester.id} className="border-t">
                        <td className="p-3">
                           <Link
                              href={`/admin/semesters/${semester.id}`}
                              className="font-medium hover:underline"
                           >
                              {semester.name} {semester.year}
                           </Link>
                        </td>
                        <td className="p-3">{new Date(semester.startDate).toLocaleDateString()}</td>
                        <td className="p-3">{new Date(semester.endDate).toLocaleDateString()}</td>
                        <td className="p-3">{semester.feeAmount}</td>
                        <td className="p-3">{semester.status}</td>
                        <td className="p-3 space-x-2">
                           {semester.status === "UPCOMING" && (
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleStatusChange(semester.id, "ONGOING")}
                              >
                                 Start
                              </Button>
                           )}
                           {semester.status === "ONGOING" && (
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleStatusChange(semester.id, "COMPLETED")}
                              >
                                 Complete
                              </Button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
