"use client";

import { useDropRegistration, useGetMyRegistrations } from "@/hooks";

const statusStyle: Record<string, string> = {
   REGISTERED: "text-green-600",
   COMPLETED: "text-blue-600",
   DROPPED: "text-red-600",
};

export default function MyCoursesPage() {
   const { data, isLoading, isError } = useGetMyRegistrations();
   const { mutate: dropRegistration, isPending } = useDropRegistration();

   const registrations = data?.data ?? [];

   const handleDrop = (registrationId: string) => {
      if (confirm("Are you sure you want to drop this course?")) {
         dropRegistration(registrationId);
      }
   };

   return (
      <div className="p-6">
         <h1 className="mb-6 text-2xl font-semibold">My Courses</h1>

         {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load your courses.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Course</th>
                        <th className="px-4 py-3 font-medium">Semester</th>
                        <th className="px-4 py-3 font-medium">Instructor</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {registrations.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                              No registered courses.
                           </td>
                        </tr>
                     )}
                     {registrations.map((reg) => (
                        <tr key={reg.id} className="border-t">
                           <td className="px-4 py-3">
                              {reg.section.course.code} - {reg.section.course.title}
                           </td>
                           <td className="px-4 py-3">{reg.section.semester.name}</td>
                           <td className="px-4 py-3">{reg.section.instructor?.name ?? "-"}</td>
                           <td className={`px-4 py-3 font-medium ${statusStyle[reg.status] ?? ""}`}>
                              {reg.status}
                           </td>
                           <td className="px-4 py-3">
                              {reg.status === "REGISTERED" && (
                                 <button
                                    onClick={() => handleDrop(reg.id)}
                                    disabled={isPending}
                                    className="text-red-600 hover:underline disabled:opacity-50"
                                 >
                                    Drop
                                 </button>
                              )}
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
