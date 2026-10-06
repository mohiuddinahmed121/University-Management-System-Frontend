"use client";

import { useGetAllRegistrations } from "@/hooks";
import { useState } from "react";

export default function AdminRegistrationsPage() {
   const [status, setStatus] = useState("");

   const { data, isLoading } = useGetAllRegistrations({
      status: (status || undefined) as never,
      limit: 20,
   });

   const registrations = data?.data ?? [];

   return (
      <div className="space-y-4">
         <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
         >
            <option value="">All Status</option>
            <option value="REGISTERED">Registered</option>
            <option value="DROPPED">Dropped</option>
            <option value="COMPLETED">Completed</option>
         </select>

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Student</th>
                     <th className="p-3">Course</th>
                     <th className="p-3">Section</th>
                     <th className="p-3">Semester</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Registered At</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading && (
                     <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                           Loading...
                        </td>
                     </tr>
                  )}

                  {!isLoading && registrations.length === 0 && (
                     <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                           No registrations found
                        </td>
                     </tr>
                  )}

                  {registrations.map((reg) => (
                     <tr key={reg.id} className="border-t">
                        <td className="p-3">
                           {reg.student?.name} ({reg.student?.studentId})
                        </td>
                        <td className="p-3">{reg.section.course.code}</td>
                        <td className="p-3">{reg.section.sectionName}</td>
                        <td className="p-3">
                           {reg.section.semester.name} {reg.section.semester.year}
                        </td>
                        <td className="p-3">{reg.status}</td>
                        <td className="p-3">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
