"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useGetSingleSemester, useUpdateSemester } from "@/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSingleSemesterPage() {
   const params = useParams<{ semesterId: string }>();
   const semesterId = params.semesterId;

   const { data, isLoading } = useGetSingleSemester(semesterId);
   const { mutate: updateSemester, isPending } = useUpdateSemester();

   const semester = data?.data;

   const [form, setForm] = useState({ feeAmount: "", startDate: "", endDate: "" });

   useEffect(() => {
      if (semester) {
         setForm({
            feeAmount: String(semester.feeAmount),
            startDate: semester.startDate.slice(0, 10),
            endDate: semester.endDate.slice(0, 10),
         });
      }
   }, [semester]);

   if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
   if (!semester) return <p className="text-destructive">Semester not found</p>;

   const isLocked = semester.status === "COMPLETED";

   const handleUpdate = () => {
      updateSemester(
         {
            semesterId,
            payload: {
               feeAmount: Number(form.feeAmount),
               startDate: form.startDate,
               endDate: form.endDate,
            },
         },
         {
            onSuccess: () =>
               toast.add({ title: "Updated", description: "Semester updated", type: "success" }),
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   return (
      <div className="space-y-4">
         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>
                  {semester.name} {semester.year} —{" "}
                  <span className="text-muted-foreground">{semester.status}</span>
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <Field>
                  <FieldLabel>Start Date</FieldLabel>
                  <Input
                     type="date"
                     value={form.startDate}
                     disabled={isLocked}
                     onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>End Date</FieldLabel>
                  <Input
                     type="date"
                     value={form.endDate}
                     disabled={isLocked}
                     onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Fee Amount</FieldLabel>
                  <Input
                     type="number"
                     value={form.feeAmount}
                     disabled={isLocked}
                     onChange={(e) => setForm({ ...form, feeAmount: e.target.value })}
                  />
               </Field>
               {!isLocked && (
                  <Button onClick={handleUpdate} disabled={isPending}>
                     {isPending ? "Saving..." : "Save Changes"}
                  </Button>
               )}
               {isLocked && (
                  <p className="text-sm text-muted-foreground">
                     Completed semester cannot be edited.
                  </p>
               )}
            </CardContent>
         </Card>

         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>Sections ({semester._count?.sections ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
               {semester.sections && semester.sections.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                     {semester.sections.map((section) => (
                        <li key={section.id}>
                           {section.course.code} — {section.course.title}
                           {section.instructor
                              ? ` (${section.instructor.name})`
                              : " (No instructor assigned)"}
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-sm text-muted-foreground">No sections yet</p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
