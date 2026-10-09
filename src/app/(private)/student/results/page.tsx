"use client";

import { useGetMyResults } from "@/hooks";

export default function MyResultsPage() {
   const { data: response, isLoading, isError } = useGetMyResults();

   const results = response?.data ?? [];

   return (
      <div className="p-6">
         <h1 className="mb-6 text-2xl font-semibold">My Results</h1>

         {isLoading && <p className="text-sm text-muted-foreground">Loading results...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load results.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Course</th>
                        <th className="px-4 py-3 font-medium">Semester</th>
                        <th className="px-4 py-3 font-medium">Marks</th>
                        <th className="px-4 py-3 font-medium">Grade</th>
                        <th className="px-4 py-3 font-medium">Grade Point</th>
                     </tr>
                  </thead>
                  <tbody>
                     {results.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                              No results published yet.
                           </td>
                        </tr>
                     )}
                     {results.map((result) => (
                        <tr key={result.id} className="border-t">
                           <td className="px-4 py-3">
                              {result.registration.section.course.code} -{" "}
                              {result.registration.section.course.title}
                           </td>
                           <td className="px-4 py-3">
                              {result.registration.section.semester.name}{" "}
                              {result.registration.section.semester.year}
                           </td>
                           <td className="px-4 py-3">{result.marks}</td>
                           <td className="px-4 py-3 font-medium">{result.grade}</td>
                           <td className="px-4 py-3">
                              {result.gradePoint != null
                                 ? Number(result.gradePoint).toFixed(2)
                                 : "-"}
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
