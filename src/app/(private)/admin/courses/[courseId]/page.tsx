"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
   useAddPrerequisite,
   useGetSingleCourse,
   useRemovePrerequisite,
   useUpdateCourse,
} from "@/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSingleCoursePage() {
   const params = useParams<{ courseId: string }>();
   const courseId = params.courseId;

   const { data, isLoading } = useGetSingleCourse(courseId);
   const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
   const { mutate: addPrerequisite, isPending: isAdding } = useAddPrerequisite();
   const { mutate: removePrerequisite } = useRemovePrerequisite();

   const course = data?.data;

   const [form, setForm] = useState({ title: "", description: "", credit: "" });
   const [prereqId, setPrereqId] = useState("");

   useEffect(() => {
      if (course) {
         setForm({
            title: course.title,
            description: course.description || "",
            credit: String(course.credit),
         });
      }
   }, [course]);

   if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
   if (!course) return <p className="text-destructive">Course not found</p>;

   const handleUpdate = () => {
      updateCourse(
         {
            courseId,
            payload: {
               title: form.title,
               description: form.description,
               credit: Number(form.credit),
            },
         },
         {
            onSuccess: () =>
               toast.add({ title: "Updated", description: "Course updated", type: "success" }),
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   const handleAddPrerequisite = () => {
      if (!prereqId) return;
      addPrerequisite(
         { courseId, payload: { prerequisiteCourseId: prereqId } },
         {
            onSuccess: () => {
               toast.add({ title: "Added", description: "Prerequisite added", type: "success" });
               setPrereqId("");
            },
            onError: (error) =>
               toast.add({ title: "Failed", description: error?.message, type: "error" }),
         },
      );
   };

   const handleRemovePrerequisite = (prerequisiteCourseId: string) => {
      removePrerequisite(
         { courseId, prerequisiteCourseId },
         {
            onSuccess: () =>
               toast.add({
                  title: "Removed",
                  description: "Prerequisite removed",
                  type: "success",
               }),
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
                  {course.code} — {course.title}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                     value={form.title}
                     onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Credit</FieldLabel>
                  <Input
                     type="number"
                     value={form.credit}
                     onChange={(e) => setForm({ ...form, credit: e.target.value })}
                  />
               </Field>
               <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input
                     value={form.description}
                     onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
               </Field>
               <Button onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
               </Button>
            </CardContent>
         </Card>

         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex gap-2">
                  <Input
                     placeholder="Prerequisite Course ID"
                     value={prereqId}
                     onChange={(e) => setPrereqId(e.target.value)}
                  />
                  <Button onClick={handleAddPrerequisite} disabled={isAdding}>
                     Add
                  </Button>
               </div>

               {course.prerequisites && course.prerequisites.length > 0 ? (
                  <ul className="space-y-2">
                     {course.prerequisites.map((prereq) => (
                        <li key={prereq.id} className="flex items-center justify-between text-sm">
                           <span>
                              {prereq.prerequisiteCourse.code} — {prereq.prerequisiteCourse.title}
                           </span>
                           <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemovePrerequisite(prereq.prerequisiteCourseId)}
                           >
                              Remove
                           </Button>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-sm text-muted-foreground">No prerequisites added</p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
