"use client";

import { useGetAllStudents } from "@/hooks";
import Link from "next/link";
import { useState } from "react";

export default function AllStudentsPage() {
   const [page, setPage] = useState(1);
   const [limit] = useState(10);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchInput, setSearchInput] = useState("");

   const { data, isLoading, isError } = useGetAllStudents({
      page,
      limit,
      searchTerm,
   });

   const students = data?.data ?? [];
   const meta = data?.meta;

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
      setSearchTerm(searchInput.trim());
   };

   return (
      <div className="p-6">
         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">All Students</h1>

            <form onSubmit={handleSearch} className="flex gap-2">
               <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name, email or student ID..."
                  className="w-64 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
               />
               <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-white">
                  Search
               </button>
            </form>
         </div>

         {isLoading && <p className="text-sm text-muted-foreground">Loading students...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load students.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Student ID</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Program</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {students.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                              No students found.
                           </td>
                        </tr>
                     )}

                     {students.map((student) => (
                        <tr key={student.id} className="border-t">
                           <td className="px-4 py-3">{student.studentId}</td>
                           <td className="px-4 py-3">{student.name}</td>
                           <td className="px-4 py-3">{student.email}</td>
                           <td className="px-4 py-3">{student.program.name}</td>
                           <td className="px-4 py-3">{student.program.department.name}</td>
                           <td className="px-4 py-3">
                              <Link
                                 href={`/admin/students/${student.id}`}
                                 className="text-primary hover:underline"
                              >
                                 View
                              </Link>
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
