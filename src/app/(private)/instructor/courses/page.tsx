"use client";

import Link from "next/link";
import { useGetMySections } from "@/hooks";
import { Spinner } from "@/components/ui/spinner";
import type { IMySection } from "@/types";

export default function MyCoursesPage() {
   const {
      data: response,
      isLoading,
      isError,
   } = useGetMySections({
      page: 1,
      limit: 100,
   });

   const sections = response?.data ?? [];

   const courseMap = new Map<string, { course: IMySection["course"]; sections: IMySection[] }>();

   for (const section of sections) {
      const existing = courseMap.get(section.course.id);
      if (existing) {
         existing.sections.push(section);
      } else {
         courseMap.set(section.course.id, { course: section.course, sections: [section] });
      }
   }

   const courses = Array.from(courseMap.values());

   return (
      <div className="flex flex-col gap-5">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
            <p className="text-sm text-muted-foreground">
               Courses you are currently teaching, grouped from your sections
            </p>
         </div>

         {isLoading && (
            <div className="flex items-center justify-center py-12">
               <Spinner />
            </div>
         )}

         {isError && (
            <p className="py-8 text-center text-sm text-destructive">
               Failed to load your courses.
            </p>
         )}

         {!isLoading && !isError && courses.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
               You are not assigned to any course yet.
            </p>
         )}

         {!isLoading && !isError && courses.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {courses.map(({ course, sections: courseSections }) => (
                  <Link
                     key={course.id}
                     href={`/instructor/sections?courseId=${course.id}`}
                     className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                     <h2 className="font-semibold">{course.code}</h2>
                     <p className="text-sm text-muted-foreground">{course.title}</p>
                     <p className="mt-1 text-xs text-muted-foreground">
                        {course.credit} credit{course.credit > 1 ? "s" : ""}
                     </p>
                     <p className="mt-3 text-xs text-muted-foreground">
                        {courseSections.length} section{courseSections.length > 1 ? "s" : ""}
                     </p>
                  </Link>
               ))}
            </div>
         )}
      </div>
   );
}
