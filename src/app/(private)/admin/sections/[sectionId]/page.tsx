"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useGetSingleSection, useUpdateSection } from "@/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSingleSectionPage() {
   const params = useParams<{ sectionId: string }>();
   const sectionId = params.sectionId;

   const { data, isLoading } = useGetSingleSection(sectionId);
   const { mutate: updateSection, isPending } = useUpdateSection();

   const section = data?.data;

   const [form, setForm] = useState({ capacity: "", instructorId: "" });

   useEffect(() => {
      if (section) {
         setForm({
            capacity: String(section.capacity),
            instructorId: section.instructorId || "",
         });
      }
   }, [section]);

   if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
   if (!section) return <p className="text-destructive">Section not found</p>;

   const handleUpdate = () => {
      updateSection(
         {
            sectionId,
            payload: {
               capacity: Number(form.capacity),
               instructorId: form.instructorId || undefined,
            },
         },
         {
            onSuccess: () =>
               toast.add({ title: "Updated", description: "Section updated", type: "success" }),
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
                  {section.course.code} — Section {section.sectionName}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <p className="text-sm text-muted-foreground">
                  {section.semester.name} {section.semester.year} — {section.status}
               </p>

               <Field>
                  <FieldLabel>Capacity</FieldLabel>
                  <Input
                     type="number"
                     value={form.capacity}
                     disabled={section.status !== "OPEN"}
                     onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Instructor ID</FieldLabel>
                  <Input
                     value={form.instructorId}
                     disabled={section.status !== "OPEN"}
                     onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                  />
               </Field>

               {section.status === "OPEN" && (
                  <Button onClick={handleUpdate} disabled={isPending}>
                     {isPending ? "Saving..." : "Save Changes"}
                  </Button>
               )}
            </CardContent>
         </Card>

         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>Registered Students ({section._count?.registrations ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
               {section.registrations && section.registrations.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                     {section.registrations.map((reg) => (
                        <li key={reg.id}>
                           {reg.student.name} ({reg.student.studentId})
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-sm text-muted-foreground">No students registered yet</p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
