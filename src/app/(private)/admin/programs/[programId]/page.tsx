"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useGetSingleProgram, useUpdateProgram } from "@/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSingleProgramPage() {
   const params = useParams<{ programId: string }>();
   const programId = params.programId;

   const { data, isLoading } = useGetSingleProgram(programId);
   const { mutate: updateProgram, isPending } = useUpdateProgram();

   const program = data?.data;

   const [form, setForm] = useState({ name: "", code: "", description: "", durationYears: "" });

   useEffect(() => {
      if (program) {
         setForm({
            name: program.name,
            code: program.code,
            description: program.description || "",
            durationYears: String(program.durationYears),
         });
      }
   }, [program]);

   if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
   if (!program) return <p className="text-destructive">Program not found</p>;

   const handleUpdate = () => {
      updateProgram(
         {
            programId,
            payload: {
               name: form.name,
               code: form.code,
               description: form.description,
               durationYears: Number(form.durationYears),
            },
         },
         {
            onSuccess: () =>
               toast.add({ title: "Updated", description: "Program updated", type: "success" }),
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   return (
      <div className="space-y-4">
         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>{program.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                     value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Code</FieldLabel>
                  <Input
                     value={form.code}
                     onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Duration (Years)</FieldLabel>
                  <Input
                     type="number"
                     value={form.durationYears}
                     onChange={(e) => setForm({ ...form, durationYears: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input
                     value={form.description}
                     onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
               </Field>
               <Button onClick={handleUpdate} disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
               </Button>
            </CardContent>
         </Card>

         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>Enrolled Students ({program._count?.students ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
               {program.students && program.students.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                     {program.students.map((student) => (
                        <li key={student.id}>
                           {student.name} ({student.studentId}) — {student.email}
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-sm text-muted-foreground">No students enrolled yet</p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
