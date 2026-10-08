"use client";

import Link from "next/link";
import { useInstructorPublicProfile, useMyInstructor } from "@/hooks";

export default function InstructorDashboardPage() {
   const { data: me, isLoading, isError } = useMyInstructor();
   const instructor = me?.instructor;

   const { data: publicProfile } = useInstructorPublicProfile(instructor?.instructorId ?? "");

   if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
   if (isError || !me || !instructor) {
      return <p className="p-6 text-sm text-red-500">Failed to load dashboard.</p>;
   }

   const departmentName = publicProfile?.department?.name ?? "-";

   // Profile completion
   const fields = [
      { label: "Contact Number", done: !!instructor.contactNumber },
      { label: "Address", done: !!instructor.address },
      { label: "Designation", done: !!instructor.designation },
      { label: "Specialization", done: !!instructor.specialization },
   ];
   const completed = fields.filter((f) => f.done).length;
   const percent = Math.round((completed / fields.length) * 100);
   const missing = fields.filter((f) => !f.done);

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-semibold">Welcome, {instructor.name}</h1>
            <p className="text-sm text-muted-foreground">
               Instructor ID: {instructor.instructorId}
            </p>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border p-4">
               <p className="text-sm text-muted-foreground">Department</p>
               <p className="mt-1 font-medium">{departmentName}</p>
            </div>
            <div className="rounded-md border p-4">
               <p className="text-sm text-muted-foreground">Designation</p>
               <p className="mt-1 font-medium">{instructor.designation ?? "Not set"}</p>
            </div>
            <div className="rounded-md border p-4">
               <p className="text-sm text-muted-foreground">Specialization</p>
               <p className="mt-1 font-medium">{instructor.specialization ?? "Not set"}</p>
            </div>
            <div className="rounded-md border p-4">
               <p className="text-sm text-muted-foreground">Account Status</p>
               <p className="mt-1 font-medium">{instructor.verificationStatus}</p>
            </div>
         </div>

         <div className="max-w-xl rounded-md border p-4">
            <div className="mb-2 flex items-center justify-between">
               <h2 className="font-medium">Profile completion</h2>
               <span className="text-sm text-muted-foreground">{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
               <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
            </div>
            {missing.length > 0 && (
               <p className="mt-3 text-sm text-muted-foreground">
                  Missing: {missing.map((m) => m.label).join(", ")}
               </p>
            )}
            <Link
               href="/instructor/profile"
               className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-white"
            >
               {percent === 100 ? "View Profile" : "Complete Profile"}
            </Link>
         </div>
      </div>
   );
}
