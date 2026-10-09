"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "@/components/ui/toast";
import { useInstructorPublicProfile, useMyInstructor, useUpdateMyInstructorProfile } from "@/hooks";

const inputClass =
   "w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

export default function InstructorProfilePage() {
   const { data: me, isLoading, isError } = useMyInstructor();
   const instructor = me?.instructor;

   const { data: publicProfile } = useInstructorPublicProfile(instructor?.instructorId ?? "");
   const { mutate: updateProfile, isPending } = useUpdateMyInstructorProfile();

   const [isEditing, setIsEditing] = useState(false);
   const [contactNumber, setContactNumber] = useState("");
   const [address, setAddress] = useState("");
   const [designation, setDesignation] = useState("");
   const [specialization, setSpecialization] = useState("");

   useEffect(() => {
      if (instructor) {
         setContactNumber(instructor.contactNumber ?? "");
         setAddress(instructor.address ?? "");
         setDesignation(instructor.designation ?? "");
         setSpecialization(instructor.specialization ?? "");
      }
   }, [instructor]);

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      updateProfile(
         {
            contactNumber: contactNumber || undefined,
            address: address || undefined,
            designation: designation || undefined,
            specialization: specialization || undefined,
         },
         {
            onSuccess: () => {
               toast.add({
                  title: "Profile updated",
                  description: "Your changes have been saved",
                  type: "success",
               });
               setIsEditing(false);
            },
            onError: (err) => {
               toast.add({
                  title: "Update failed",
                  description: err.message || "Something went wrong. Please try again.",
                  type: "error",
               });
            },
         },
      );
   };

   if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
   if (isError || !instructor) {
      return <p className="p-6 text-sm text-red-500">Failed to load profile.</p>;
   }

   const rows: { label: string; value: string }[] = [
      { label: "Instructor ID", value: instructor.instructorId },
      { label: "Name", value: instructor.name },
      { label: "Email", value: instructor.email },
      { label: "Department", value: publicProfile?.department?.name ?? "-" },
      { label: "Designation", value: instructor.designation ?? "-" },
      { label: "Specialization", value: instructor.specialization ?? "-" },
      { label: "Contact Number", value: instructor.contactNumber ?? "-" },
      { label: "Address", value: instructor.address ?? "-" },
      { label: "Status", value: instructor.verificationStatus },
   ];

   return (
      <div className="p-6">
         <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">My Profile</h1>
            {!isEditing && (
               <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-white"
               >
                  Edit Profile
               </button>
            )}
         </div>

         <div className="max-w-xl rounded-md border p-6">
            {!isEditing ? (
               <dl className="divide-y">
                  {rows.map((row) => (
                     <div key={row.label} className="grid grid-cols-2 gap-4 py-3">
                        <dt className="text-sm text-muted-foreground">{row.label}</dt>
                        <dd className="text-sm font-medium">{row.value}</dd>
                     </div>
                  ))}
                  {instructor.resumeUrl && (
                     <div className="grid grid-cols-2 gap-4 py-3">
                        <dt className="text-sm text-muted-foreground">Resume</dt>
                        <dd className="text-sm font-medium">
                           <a
                              href={instructor.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                           >
                              View resume
                           </a>
                        </dd>
                     </div>
                  )}
               </dl>
            ) : (
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">
                        Contact Number
                     </label>
                     <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className={inputClass}
                     />
                  </div>
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">Address</label>
                     <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputClass}
                     />
                  </div>
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">Designation</label>
                     <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className={inputClass}
                     />
                  </div>
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">
                        Specialization
                     </label>
                     <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className={inputClass}
                     />
                  </div>
                  <div className="flex gap-2">
                     <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
                     >
                        {isPending ? "Saving..." : "Save Changes"}
                     </button>
                     <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="rounded-md border px-4 py-2 text-sm"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            )}
         </div>
      </div>
   );
}
