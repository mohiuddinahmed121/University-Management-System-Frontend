"use client";

import { useGetAllCourses } from "@/hooks";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function StudentCourseCatalogPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const { data, isLoading } = useGetAllCourses({ searchTerm: searchTerm || undefined, limit: 50 });
   const courses = data?.data ?? [];

   return (
      <div className="space-y-4">
         <Input
            placeholder="Search courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
         />

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Code</th>
                     <th className="p-3">Title</th>
                     <th className="p-3">Credit</th>
                     <th className="p-3">Department</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading && (
                     <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                           Loading...
                        </td>
                     </tr>
                  )}
                  {!isLoading && courses.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                           No courses found
                        </td>
                     </tr>
                  )}
                  {courses.map((course) => (
                     <tr key={course.id} className="border-t">
                        <td className="p-3">{course.code}</td>
                        <td className="p-3">{course.title}</td>
                        <td className="p-3">{course.credit}</td>
                        <td className="p-3">{course.department?.name}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
