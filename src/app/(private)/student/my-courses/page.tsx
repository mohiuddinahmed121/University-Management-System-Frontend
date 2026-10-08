"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDropRegistration, useGetMyRegistrations } from "@/hooks";

export default function MyCoursesPage() {
   const { data, isLoading } = useGetMyRegistrations({ limit: 50 });
   const { mutate: drop, isPending } = useDropRegistration();

   const registrations = data?.data ?? [];

   const handleDrop = (registrationId: string) => {
      drop(registrationId, {
         onSuccess: () =>
            toast.add({ title: "Dropped", description: "Registration dropped", type: "success" }),
         onError: (error) =>
            toast.add({ title: "Failed", description: error?.message, type: "error" }),
      });
   };

   return (
      <div className="p-6">
         <h1 className="mb-6 text-2xl font-semibold">My Courses</h1>

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Course</th>
                     <th className="p-3">Section</th>
                     <th className="p-3">Semester</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading && (
                     <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                           Loading...
                        </td>
                     </tr>
                  )}

                  {!isLoading && registrations.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                           No registrations yet
                        </td>
                     </tr>
                  )}

                  {registrations.map((reg) => (
                     <tr key={reg.id} className="border-t">
                        <td className="p-3">
                           {reg.section.course.code} — {reg.section.course.title}
                        </td>
                        <td className="p-3">{reg.section.sectionName}</td>
                        <td className="p-3">
                           {reg.section.semester.name} {reg.section.semester.year}
                        </td>
                        <td className="p-3">{reg.status}</td>
                        <td className="p-3">
                           {reg.status === "REGISTERED" && (
                              <Button
                                 size="sm"
                                 variant="destructive"
                                 disabled={isPending}
                                 onClick={() => handleDrop(reg.id)}
                              >
                                 Drop
                              </Button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
