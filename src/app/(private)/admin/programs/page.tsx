"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
   useCreateProgram,
   useDeleteProgram,
   useGetAllDepartments,
   useGetAllPrograms,
} from "@/hooks";
import Link from "next/link";
import { useState } from "react";

export default function AdminProgramsPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [showForm, setShowForm] = useState(false);
   const [form, setForm] = useState({
      name: "",
      code: "",
      description: "",
      durationYears: "",
      departmentId: "",
   });

   const { data, isLoading } = useGetAllPrograms({
      searchTerm: searchTerm || undefined,
      limit: 20,
   });
   const { data: departmentData } = useGetAllDepartments({ limit: 100 });
   const { mutate: createProgram, isPending: isCreating } = useCreateProgram();
   const { mutate: deleteProgram } = useDeleteProgram();

   const programs = data?.data ?? [];
   const departments = departmentData?.data ?? [];

   const handleCreate = () => {
      createProgram(
         {
            name: form.name,
            code: form.code,
            description: form.description || undefined,
            durationYears: Number(form.durationYears),
            departmentId: form.departmentId,
         },
         {
            onSuccess: () => {
               toast.add({ title: "Created", description: "Program created", type: "success" });
               setForm({
                  name: "",
                  code: "",
                  description: "",
                  durationYears: "",
                  departmentId: "",
               });
               setShowForm(false);
            },
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   const handleDelete = (programId: string) => {
      deleteProgram(programId, {
         onSuccess: () =>
            toast.add({ title: "Deleted", description: "Program deleted", type: "success" }),
         onError: (error) =>
            toast.add({ title: "Failed", description: error?.message, type: "error" }),
      });
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <Input
               placeholder="Search by name or code"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="max-w-xs"
            />
            <Button onClick={() => setShowForm((prev) => !prev)}>
               {showForm ? "Cancel" : "+ New Program"}
            </Button>
         </div>

         {showForm && (
            <div className="grid gap-3 rounded-md border p-4 sm:grid-cols-2">
               <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                     value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })}
                     placeholder="BSc in Computer Science and Engineering"
                  />
               </Field>
               <Field>
                  <FieldLabel>Code</FieldLabel>
                  <Input
                     value={form.code}
                     onChange={(e) => setForm({ ...form, code: e.target.value })}
                     placeholder="CSE-BSC"
                  />
               </Field>
               <Field>
                  <FieldLabel>Duration (Years)</FieldLabel>
                  <Input
                     type="number"
                     value={form.durationYears}
                     onChange={(e) => setForm({ ...form, durationYears: e.target.value })}
                     placeholder="4"
                  />
               </Field>
               <Field>
                  <FieldLabel>Department</FieldLabel>
                  <select
                     value={form.departmentId}
                     onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                     className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                     <option value="">Select Department</option>
                     {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                           {dept.name} ({dept.code})
                        </option>
                     ))}
                  </select>
               </Field>
               <Field className="sm:col-span-2">
                  <FieldLabel>Description (optional)</FieldLabel>
                  <Input
                     value={form.description}
                     onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
               </Field>
               <div className="sm:col-span-2">
                  <Button onClick={handleCreate} disabled={isCreating}>
                     {isCreating ? "Creating..." : "Create Program"}
                  </Button>
               </div>
            </div>
         )}

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Name</th>
                     <th className="p-3">Code</th>
                     <th className="p-3">Duration</th>
                     <th className="p-3">Department</th>
                     <th className="p-3">Students</th>
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

                  {!isLoading && programs.length === 0 && (
                     <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                           No programs found
                        </td>
                     </tr>
                  )}

                  {programs.map((program) => (
                     <tr key={program.id} className="border-t">
                        <td className="p-3">
                           <Link
                              href={`/admin/programs/${program.id}`}
                              className="font-medium hover:underline"
                           >
                              {program.name}
                           </Link>
                        </td>
                        <td className="p-3">{program.code}</td>
                        <td className="p-3">{program.durationYears} yrs</td>
                        <td className="p-3">{program.department?.name}</td>
                        <td className="p-3">{program._count?.students ?? 0}</td>
                        <td className="p-3">
                           <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(program.id)}
                           >
                              Delete
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
