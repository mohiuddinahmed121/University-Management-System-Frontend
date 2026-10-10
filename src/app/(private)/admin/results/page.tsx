"use client";

import { useGetAllResults } from "@/hooks";
import { useState } from "react";

export default function AllResultsPage() {
   const [page, setPage] = useState(1);
   const [limit] = useState(10);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchInput, setSearchInput] = useState("");

   const { data, isLoading, isError } = useGetAllResults({
      page,
      limit,
      searchTerm,
   });

   const results = data?.data ?? [];
   const meta = data?.meta;

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
      setSearchTerm(searchInput.trim());
   };

   const formatGradePoint = (gradePoint: string | number | null | undefined) => {
      if (gradePoint === null || gradePoint === undefined) return "-";
      const num = Number(gradePoint);
      return Number.isNaN(num) ? "-" : num.toFixed(2);
   };

   return (
      <div className="p-6">
         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">All Results</h1>

            <form onSubmit={handleSearch} className="flex gap-2">
               <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by student, course or grade..."
                  className="w-64 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               />
               <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-white">
                  Search
               </button>
            </form>
         </div>

         {isLoading && <p className="text-sm text-muted-foreground">Loading results...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load results.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Student</th>
                        <th className="px-4 py-3 font-medium">Student ID</th>
                        <th className="px-4 py-3 font-medium">Course</th>
                        <th className="px-4 py-3 font-medium">Semester</th>
                        <th className="px-4 py-3 font-medium">Instructor</th>
                        <th className="px-4 py-3 font-medium">Marks</th>
                        <th className="px-4 py-3 font-medium">Grade</th>
                        <th className="px-4 py-3 font-medium">Grade Point</th>
                        <th className="px-4 py-3 font-medium">Submitted At</th>
                     </tr>
                  </thead>
                  <tbody>
                     {results.length === 0 && (
                        <tr>
                           <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                              No results found.
                           </td>
                        </tr>
                     )}

                     {results.map((result) => (
                        <tr key={result.id} className="border-t">
                           <td className="px-4 py-3">{result.registration.student.name}</td>
                           <td className="px-4 py-3">{result.registration.student.studentId}</td>
                           <td className="px-4 py-3">
                              {result.registration.section.course.code} -{" "}
                              {result.registration.section.course.title}
                           </td>
                           <td className="px-4 py-3">
                              {result.registration.section.semester.name}
                           </td>
                           <td className="px-4 py-3">
                              {result.registration.section.instructor?.name ?? "-"}
                           </td>
                           <td className="px-4 py-3">{result.marks}</td>
                           <td className="px-4 py-3 font-medium">{result.grade}</td>
                           <td className="px-4 py-3">{formatGradePoint(result.gradePoint)}</td>
                           <td className="px-4 py-3">
                              {new Date(result.submittedAt).toLocaleDateString()}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
               <p className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages} ({meta.total} total)
               </p>
               <div className="flex gap-2">
                  <button
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page <= 1}
                     className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                     Previous
                  </button>
                  <button
                     onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                     disabled={page >= meta.totalPages}
                     className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                     Next
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
