"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
   useCloseSection,
   useCreateSection,
   useDeleteSection,
   useGetAllCourses,
   useGetAllInstructors,
   useGetAllSections,
   useGetAllSemesters,
} from "@/hooks";
import Link from "next/link";
import { useState } from "react";

export default function AdminSectionsPage() {
   const [showForm, setShowForm] = useState(false);
   const [filterCourseId, setFilterCourseId] = useState("");
   const [filterSemesterId, setFilterSemesterId] = useState("");

   const [form, setForm] = useState({
      sectionName: "",
      capacity: "",
      courseId: "",
      semesterId: "",
      instructorId: "",
   });

   const { data, isLoading } = useGetAllSections({
      courseId: filterCourseId || undefined,
      semesterId: filterSemesterId || undefined,
      limit: 20,
   });
   const { data: courseData } = useGetAllCourses({ limit: 100 });
   const { data: semesterData } = useGetAllSemesters({ limit: 100 });
   const { data: instructorData } = useGetAllInstructors({ limit: 100 });
   const { mutate: createSection, isPending: isCreating } = useCreateSection();
   const { mutate: closeSection } = useCloseSection();
   const { mutate: deleteSection } = useDeleteSection();

   const sections = data?.data ?? [];
   const courses = courseData?.data ?? [];
   const semesters = semesterData?.data ?? [];
   const approvedInstructors = (instructorData?.data ?? []).filter(
      (i) => i.verificationStatus === "APPROVED",
   );

   const handleCreate = () => {
      createSection(
         {
            sectionName: form.sectionName,
            capacity: Number(form.capacity),
            courseId: form.courseId,
            semesterId: form.semesterId,
            instructorId: form.instructorId || undefined,
         },
         {
            onSuccess: () => {
               toast.add({ title: "Created", description: "Section created", type: "success" });
               setForm({
                  sectionName: "",
                  capacity: "",
                  courseId: "",
                  semesterId: "",
                  instructorId: "",
               });
               setShowForm(false);
            },
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   const handleClose = (sectionId: string) => {
      closeSection(sectionId, {
         onSuccess: () =>
            toast.add({ title: "Closed", description: "Section closed", type: "success" }),
         onError: (error) =>
            toast.add({ title: "Failed", description: error?.message, type: "error" }),
      });
   };

   const handleDelete = (sectionId: string) => {
      deleteSection(sectionId, {
         onSuccess: () =>
            toast.add({ title: "Deleted", description: "Section removed", type: "success" }),
         onError: (error) =>
            toast.add({ title: "Failed", description: error?.message, type: "error" }),
      });
   };

   return (
      <div className="space-y-4">
         <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
               <select
                  value={filterCourseId}
                  onChange={(e) => setFilterCourseId(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
               >
                  <option value="">All Courses</option>
                  {courses.map((c) => (
                     <option key={c.id} value={c.id}>
                        {c.code}
                     </option>
                  ))}
               </select>

               <select
                  value={filterSemesterId}
                  onChange={(e) => setFilterSemesterId(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
               >
                  <option value="">All Semesters</option>
                  {semesters.map((s) => (
                     <option key={s.id} value={s.id}>
                        {s.name} {s.year}
                     </option>
                  ))}
               </select>
            </div>

            <Button onClick={() => setShowForm((prev) => !prev)}>
               {showForm ? "Cancel" : "+ New Section"}
            </Button>
         </div>

         {showForm && (
            <div className="grid gap-3 rounded-md border p-4 sm:grid-cols-2">
               <Field>
                  <FieldLabel>Section Name</FieldLabel>
                  <Input
                     value={form.sectionName}
                     onChange={(e) => setForm({ ...form, sectionName: e.target.value })}
                     placeholder="A"
                  />
               </Field>
               <Field>
                  <FieldLabel>Capacity</FieldLabel>
                  <Input
                     type="number"
                     value={form.capacity}
                     onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                     placeholder="40"
                  />
               </Field>
               <Field>
                  <FieldLabel>Course</FieldLabel>
                  <select
                     value={form.courseId}
                     onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                     className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                     <option value="">Select Course</option>
                     {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                           {c.code} — {c.title}
                        </option>
                     ))}
                  </select>
               </Field>
               <Field>
                  <FieldLabel>Semester</FieldLabel>
                  <select
                     value={form.semesterId}
                     onChange={(e) => setForm({ ...form, semesterId: e.target.value })}
                     className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                     <option value="">Select Semester</option>
                     {semesters.map((s) => (
                        <option key={s.id} value={s.id}>
                           {s.name} {s.year}
                        </option>
                     ))}
                  </select>
               </Field>
               <Field className="sm:col-span-2">
                  <FieldLabel>Instructor (optional)</FieldLabel>
                  <select
                     value={form.instructorId}
                     onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                     className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                     <option value="">Unassigned</option>
                     {approvedInstructors.map((i) => (
                        <option key={i.id} value={i.id}>
                           {i.name} ({i.instructorId}) — {i.department?.name}
                        </option>
                     ))}
                  </select>
               </Field>
               <div className="sm:col-span-2">
                  <Button onClick={handleCreate} disabled={isCreating}>
                     {isCreating ? "Creating..." : "Create Section"}
                  </Button>
               </div>
            </div>
         )}

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Course</th>
                     <th className="p-3">Section</th>
                     <th className="p-3">Semester</th>
                     <th className="p-3">Instructor</th>
                     <th className="p-3">Seats</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading && (
                     <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                           Loading...
                        </td>
                     </tr>
                  )}

                  {!isLoading && sections.length === 0 && (
                     <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                           No sections found
                        </td>
                     </tr>
                  )}

                  {sections.map((section) => (
                     <tr key={section.id} className="border-t">
                        <td className="p-3">
                           <Link
                              href={`/admin/sections/${section.id}`}
                              className="font-medium hover:underline"
                           >
                              {section.course.code}
                           </Link>
                        </td>
                        <td className="p-3">{section.sectionName}</td>
                        <td className="p-3">
                           {section.semester.name} {section.semester.year}
                        </td>
                        <td className="p-3">{section.instructor?.name ?? "Unassigned"}</td>
                        <td className="p-3">
                           {section.availableSeats}/{section.capacity}
                        </td>
                        <td className="p-3">{section.status}</td>
                        <td className="p-3 space-x-2">
                           {section.status === "OPEN" && (
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleClose(section.id)}
                              >
                                 Close
                              </Button>
                           )}
                           <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(section.id)}
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
