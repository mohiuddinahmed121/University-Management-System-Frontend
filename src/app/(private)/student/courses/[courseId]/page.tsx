"use client";

import { toast } from "@/components/ui/toast";
import { useCreateRegistration, useGetSingleCourse } from "@/hooks";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetailPage() {
   const params = useParams();
   const router = useRouter();
   const courseId = params.courseId as string;

   const { data, isLoading, isError } = useGetSingleCourse(courseId);
   const { mutate: register, isPending } = useCreateRegistration();

   const course = data?.data;

   const handleRegister = (sectionId: string) => {
      register(
         { sectionId },
         {
            onSuccess: () => {
               toast.add({
                  title: "Registered",
                  description: "You have registered for this section",
                  type: "success",
               });
               router.push("/student/my-courses");
            },
            onError: (error) => {
               toast.add({
                  title: "Registration failed",
                  description: error?.message || "Something went wrong. Please try again.",
                  type: "error",
               });
            },
         },
      );
   };

   if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
   if (isError || !course) return <p className="p-6 text-sm text-red-500">Course not found.</p>;

   return (
      <div className="p-6">
         <div className="mb-6">
            <h1 className="text-2xl font-semibold">
               {course.code} - {course.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
               {course.credit} Credits · {course.department.name}
            </p>
            {course.description && (
               <p className="mt-3 text-sm text-muted-foreground">{course.description}</p>
            )}
         </div>

         <h2 className="mb-3 text-lg font-medium">Available Sections</h2>

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-left text-sm">
               <thead className="bg-muted">
                  <tr>
                     <th className="px-4 py-3 font-medium">Section</th>
                     <th className="px-4 py-3 font-medium">Semester</th>
                     <th className="px-4 py-3 font-medium">Instructor</th>
                     <th className="px-4 py-3 font-medium">Available Seats</th>
                     <th className="px-4 py-3 font-medium">Status</th>
                     <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {(!course.sections || course.sections.length === 0) && (
                     <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                           No sections available for this course.
                        </td>
                     </tr>
                  )}
                  {course.sections?.map((section) => {
                     const isOpen = section.status === "OPEN";
                     const isFull = section.availableSeats <= 0;

                     return (
                        <tr key={section.id} className="border-t">
                           <td className="px-4 py-3">{section.sectionName}</td>
                           <td className="px-4 py-3">
                              {section.semester.name} {section.semester.year}
                           </td>
                           <td className="px-4 py-3">{section.instructor?.name ?? "-"}</td>
                           <td className="px-4 py-3">{section.availableSeats}</td>
                           <td className="px-4 py-3">{section.status}</td>
                           <td className="px-4 py-3">
                              <button
                                 onClick={() => handleRegister(section.id)}
                                 disabled={isPending || !isOpen || isFull}
                                 className="rounded-md bg-primary px-3 py-1.5 text-xs text-white disabled:opacity-50"
                              >
                                 {isPending
                                    ? "Registering..."
                                    : isFull
                                      ? "Full"
                                      : !isOpen
                                        ? "Closed"
                                        : "Register"}
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
}
