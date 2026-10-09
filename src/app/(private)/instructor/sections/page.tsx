"use client";

import Link from "next/link";
import { useGetMySections } from "@/hooks";
import { Spinner } from "@/components/ui/spinner";

export default function MySectionsPage() {
   const {
      data: response,
      isLoading,
      isError,
   } = useGetMySections({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
   });

   const sections = response?.data ?? [];

   return (
      <div className="flex flex-col gap-5">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">My Sections</h1>
            <p className="text-sm text-muted-foreground">
               Sections assigned to you across semesters
            </p>
         </div>

         {isLoading && (
            <div className="flex items-center justify-center py-12">
               <Spinner />
            </div>
         )}

         {isError && (
            <p className="py-8 text-center text-sm text-destructive">
               Failed to load your sections.
            </p>
         )}

         {!isLoading && !isError && sections.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
               No sections assigned to you yet.
            </p>
         )}

         {!isLoading && !isError && sections.length > 0 && (
            <div className="flex flex-col gap-4">
               {sections.map((section) => (
                  <div key={section.id} className="rounded-lg border p-4">
                     <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                           <h2 className="font-semibold">
                              {section.course.code} — {section.course.title}
                           </h2>
                           <p className="text-sm text-muted-foreground">
                              Section {section.sectionName} · {section.semester.name}{" "}
                              {section.semester.year}
                           </p>
                        </div>
                        <span
                           className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              section.status === "OPEN"
                                 ? "bg-green-100 text-green-800"
                                 : section.status === "CLOSED"
                                   ? "bg-amber-100 text-amber-800"
                                   : "bg-muted text-muted-foreground"
                           }`}
                        >
                           {section.status}
                        </span>
                     </div>

                     <div className="mt-3 flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <span>Capacity: {section.capacity}</span>
                        <span>Available seats: {section.availableSeats}</span>
                        <span>Registered: {section.registrations?.length ?? 0}</span>
                     </div>

                     {section.registrations && section.registrations.length > 0 && (
                        <div className="mt-4 overflow-x-auto rounded-md border">
                           <table className="w-full text-sm">
                              <thead className="bg-muted/50">
                                 <tr className="text-left">
                                    <th className="px-3 py-2 font-medium">Student ID</th>
                                    <th className="px-3 py-2 font-medium">Name</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {section.registrations.map((reg) => (
                                    <tr key={reg.id} className="border-t">
                                       <td className="px-3 py-2 whitespace-nowrap">
                                          {reg.student.studentId}
                                       </td>
                                       <td className="px-3 py-2 whitespace-nowrap">
                                          <Link
                                             href={`/instructor/registrations/${reg.id}`}
                                             className="font-medium text-primary underline underline-offset-4"
                                          >
                                             {reg.student.name}
                                          </Link>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
