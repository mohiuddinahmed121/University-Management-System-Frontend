"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useGetSingleDepartment, useUpdateDepartment } from "@/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSingleDepartmentPage() {
   const params = useParams<{ departmentId: string }>();
   const departmentId = params.departmentId;

   const { data, isLoading } = useGetSingleDepartment(departmentId);
   const { mutate: updateDepartment, isPending } = useUpdateDepartment();

   const department = data?.data;

   const [form, setForm] = useState({ name: "", code: "", description: "" });

   useEffect(() => {
      if (department) {
         setForm({
            name: department.name,
            code: department.code,
            description: department.description || "",
         });
      }
   }, [department]);

   if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
   if (!department) return <p className="text-destructive">Department not found</p>;

   const handleUpdate = () => {
      updateDepartment(
         { departmentId, payload: form },
         {
            onSuccess: () =>
               toast.add({ title: "Updated", description: "Department updated", type: "success" }),
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   return (
      <div className="space-y-4">
         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>{department.name}</CardTitle>
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

         <div className="grid gap-4 sm:grid-cols-3">
            <Card>
               <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Programs</CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-1 text-sm">
                     {department.programs?.length ? (
                        department.programs.map((p) => <li key={p.id}>{p.name}</li>)
                     ) : (
                        <p className="text-muted-foreground">None</p>
                     )}
                  </ul>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Courses</CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-1 text-sm">
                     {department.courses?.length ? (
                        department.courses.map((c) => (
                           <li key={c.id}>
                              {c.code} — {c.title}
                           </li>
                        ))
                     ) : (
                        <p className="text-muted-foreground">None</p>
                     )}
                  </ul>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Instructors</CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-1 text-sm">
                     {department.instructors?.length ? (
                        department.instructors.map((i) => <li key={i.id}>{i.name}</li>)
                     ) : (
                        <p className="text-muted-foreground">None</p>
                     )}
                  </ul>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
