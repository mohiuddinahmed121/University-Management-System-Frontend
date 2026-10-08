"use client";

import { useCreateRegistration, useGetAllSections, useGetAllSemesters } from "@/hooks";
import { useState } from "react";

export default function CourseRegistrationPage() {
   const [semesterId, setSemesterId] = useState("");

   const { data: semestersData } = useGetAllSemesters({ limit: 50 });
   const {
      data: sectionsData,
      isLoading,
      isError,
   } = useGetAllSections({
      semesterId: semesterId || undefined,
      limit: 50,
   });
   const { mutate: register, isPending } = useCreateRegistration();

   const semesters = semestersData?.data ?? [];
   const sections = sectionsData?.data ?? [];

   const handleRegister = (sectionId: string) => {
      register({ sectionId });
   };

   return (
      <div className="p-6">
         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">Course Registration</h1>
            <select
               value={semesterId}
               onChange={(e) => setSemesterId(e.target.value)}
               className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
               <option value="">All Semesters</option>
               {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                     {s.name}
                  </option>
               ))}
            </select>
         </div>

         {isLoading && <p className="text-sm text-muted-foreground">Loading sections...</p>}
         {isError && <p className="text-sm text-red-500">Failed to load sections.</p>}

         {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-md border">
               <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 font-medium">Course</th>
                        <th className="px-4 py-3 font-medium">Semester</th>
                        <th className="px-4 py-3 font-medium">Instructor</th>
                        <th className="px-4 py-3 font-medium">Available Seats</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {sections.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                              No sections available.
                           </td>
                        </tr>
                     )}
                     {sections.map((section) => {
                        const isOpen = section.status === "OPEN";
                        const isFull = section.availableSeats <= 0;

                        return (
                           <tr key={section.id} className="border-t">
                              <td className="px-4 py-3">
                                 {section.course.code} - {section.course.title}
                              </td>
                              <td className="px-4 py-3">{section.semester.name}</td>
                              <td className="px-4 py-3">{section.instructor?.name ?? "-"}</td>
                              <td className="px-4 py-3">{section.availableSeats}</td>
                              <td className="px-4 py-3">{section.status}</td>
                              <td className="px-4 py-3">
                                 <button
                                    onClick={() => handleRegister(section.id)}
                                    disabled={isPending || !isOpen || isFull}
                                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-white disabled:opacity-50"
                                 >
                                    {isFull ? "Full" : !isOpen ? "Closed" : "Register"}
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}
