"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import { useState } from "react";
import { useCreateCourse, useDeleteCourse, useGetAllCourses, useGetAllDepartments } from "@/hooks";

export default function AdminCoursesPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [showForm, setShowForm] = useState(false);

   const { data: departmentData } = useGetAllDepartments({ limit: 100 });
   const departments = departmentData?.data ?? [];

   const [form, setForm] = useState({
      code: "",
      title: "",
      description: "",
      credit: "",
      departmentId: "",
   });

   const { data, isLoading } = useGetAllCourses({ searchTerm: searchTerm || undefined, limit: 20 });
   const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
   const { mutate: deleteCourse } = useDeleteCourse();

   const courses = data?.data ?? [];

   const handleCreate = () => {
      createCourse(
         {
            code: form.code,
            title: form.title,
            description: form.description || undefined,
            credit: Number(form.credit),
            departmentId: form.departmentId,
         },
         {
            onSuccess: () => {
               toast.add({
                  title: "Created",
                  description: "Course created successfully",
                  type: "success",
               });
               setForm({ code: "", title: "", description: "", credit: "", departmentId: "" });
               setShowForm(false);
            },
            onError: (error) => {
               toast.add({
                  title: "Failed",
                  description: error?.message || "Could not create course",
                  type: "error",
               });
            },
         },
      );
   };

   const handleDelete = (courseId: string) => {
      deleteCourse(courseId, {
         onSuccess: () => {
            toast.add({ title: "Deleted", description: "Course deleted", type: "success" });
         },
         onError: (error) => {
            toast.add({
               title: "Failed",
               description: error?.message || "Could not delete course",
               type: "error",
            });
         },
      });
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <Input
               placeholder="Search by code or title"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="max-w-xs"
            />
            <Button onClick={() => setShowForm((prev) => !prev)}>
               {showForm ? "Cancel" : "+ New Course"}
            </Button>
         </div>

         {showForm && (
            <div className="grid gap-3 rounded-md border p-4 sm:grid-cols-2">
               <Field>
                  <FieldLabel>Course Code</FieldLabel>
                  <Input
                     value={form.code}
                     onChange={(e) => setForm({ ...form, code: e.target.value })}
                     placeholder="CSE-101"
                  />
               </Field>

               <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                     value={form.title}
                     onChange={(e) => setForm({ ...form, title: e.target.value })}
                     placeholder="Introduction to Programming"
                  />
               </Field>

               <Field>
                  <FieldLabel>Credit</FieldLabel>
                  <Input
                     type="number"
                     value={form.credit}
                     onChange={(e) => setForm({ ...form, credit: e.target.value })}
                     placeholder="3"
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
                     {isCreating ? "Creating..." : "Create Course"}
                  </Button>
               </div>
            </div>
         )}

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Code</th>
                     <th className="p-3">Title</th>
                     <th className="p-3">Credit</th>
                     <th className="p-3">Department</th>
                     <th className="p-3">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading && (
                     <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                           Loading...
                        </td>
                     </tr>
                  )}

                  {!isLoading && courses.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                           No courses found
                        </td>
                     </tr>
                  )}

                  {courses.map((course) => (
                     <tr key={course.id} className="border-t">
                        <td className="p-3">
                           <Link
                              href={`/admin/courses/${course.id}`}
                              className="font-medium hover:underline"
                           >
                              {course.code}
                           </Link>
                        </td>
                        <td className="p-3">{course.title}</td>
                        <td className="p-3">{course.credit}</td>
                        <td className="p-3">{course.department?.name}</td>
                        <td className="p-3">
                           <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(course.id)}
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
