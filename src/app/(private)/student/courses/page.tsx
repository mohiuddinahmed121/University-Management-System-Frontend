"use client";

import { useGetAllCourses } from "@/hooks";
import Link from "next/link";
import { useState } from "react";

export default function StudentCoursesPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [searchInput, setSearchInput] = useState("");

   const { data, isLoading, isError } = useGetAllCourses({ searchTerm, limit: 50 });
   const courses = data?.data ?? [];

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setSearchTerm(searchInput.trim());
   };

   return (
      <div className="p-6">
         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">Courses</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
               <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by code or title..."
                  className="w-64 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               />
               <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-white">
                  Search
               </button>
            </form>
         </div>

         {isLoading && <p className="text-sm text-muted-foreground">Loading courses...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load courses.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Code</th>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Credit</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {courses.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                              No courses found.
                           </td>
                        </tr>
                     )}
                     {courses.map((course) => (
                        <tr key={course.id} className="border-t">
                           <td className="px-4 py-3">{course.code}</td>
                           <td className="px-4 py-3">{course.title}</td>
                           <td className="px-4 py-3">{course.credit}</td>
                           <td className="px-4 py-3">{course.department.name}</td>
                           <td className="px-4 py-3">
                              <Link
                                 href={`/student/courses/${course.id}`}
                                 className="text-primary hover:underline"
                              >
                                 View Sections
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}
