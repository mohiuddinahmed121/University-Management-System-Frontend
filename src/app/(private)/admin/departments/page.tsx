"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useCreateDepartment, useDeleteDepartment, useGetAllDepartments } from "@/hooks";
import Link from "next/link";
import { useState } from "react";

export default function AdminDepartmentsPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [showForm, setShowForm] = useState(false);
   const [form, setForm] = useState({ name: "", code: "", description: "" });

   const { data, isLoading } = useGetAllDepartments({
      searchTerm: searchTerm || undefined,
      limit: 20,
   });
   const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment();
   const { mutate: deleteDepartment } = useDeleteDepartment();

   const departments = data?.data ?? [];

   const handleCreate = () => {
      createDepartment(
         { name: form.name, code: form.code, description: form.description || undefined },
         {
            onSuccess: () => {
               toast.add({ title: "Created", description: "Department created", type: "success" });
               setForm({ name: "", code: "", description: "" });
               setShowForm(false);
            },
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   const handleDelete = (departmentId: string) => {
      deleteDepartment(departmentId, {
         onSuccess: () =>
            toast.add({ title: "Deleted", description: "Department deleted", type: "success" }),
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
               {showForm ? "Cancel" : "+ New Department"}
            </Button>
         </div>

         {showForm && (
            <div className="grid gap-3 rounded-md border p-4 sm:grid-cols-2">
               <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                     value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })}
                     placeholder="Computer Science and Engineering"
                  />
               </Field>
               <Field>
                  <FieldLabel>Code</FieldLabel>
                  <Input
                     value={form.code}
                     onChange={(e) => setForm({ ...form, code: e.target.value })}
                     placeholder="CSE"
                  />
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
                     {isCreating ? "Creating..." : "Create Department"}
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
                     <th className="p-3">Programs</th>
                     <th className="p-3">Courses</th>
                     <th className="p-3">Instructors</th>
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

                  {!isLoading && departments.length === 0 && (
                     <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                           No departments found
                        </td>
                     </tr>
                  )}

                  {departments.map((dept) => (
                     <tr key={dept.id} className="border-t">
                        <td className="p-3">
                           <Link
                              href={`/admin/departments/${dept.id}`}
                              className="font-medium hover:underline"
                           >
                              {dept.name}
                           </Link>
                        </td>
                        <td className="p-3">{dept.code}</td>
                        <td className="p-3">{dept._count?.programs ?? 0}</td>
                        <td className="p-3">{dept._count?.courses ?? 0}</td>
                        <td className="p-3">{dept._count?.instructors ?? 0}</td>
                        <td className="p-3">
                           <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(dept.id)}
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
