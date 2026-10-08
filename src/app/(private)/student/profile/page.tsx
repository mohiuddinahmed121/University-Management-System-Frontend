"use client";

import { useGetMyProfile, useUpdateStudentProfile } from "@/hooks";
import { useEffect, useState } from "react";

export default function StudentProfilePage() {
   const { data: profile, isLoading, isError } = useGetMyProfile();
   const { mutate: updateProfile, isPending } = useUpdateStudentProfile();

   const [isEditing, setIsEditing] = useState(false);
   const [address, setAddress] = useState("");
   const [contactNumber, setContactNumber] = useState("");
   const [dateOfBirth, setDateOfBirth] = useState("");
   const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "">("");

   useEffect(() => {
      if (profile) {
         setAddress(profile.address ?? "");
         setContactNumber(profile.contactNumber ?? "");
         setDateOfBirth(profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "");
         setGender(profile.gender ?? "");
      }
   }, [profile]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateProfile(
         {
            address: address || undefined,
            contactNumber: contactNumber || undefined,
            dateOfBirth: dateOfBirth || undefined,
            gender: gender || undefined,
         },
         {
            onSuccess: () => setIsEditing(false),
         },
      );
   };

   if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
   if (isError || !profile)
      return <p className="p-6 text-sm text-red-500">Failed to load profile.</p>;

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
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Student ID</dt>
                     <dd className="text-sm font-medium">{profile.studentId}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Name</dt>
                     <dd className="text-sm font-medium">{profile.name}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Email</dt>
                     <dd className="text-sm font-medium">{profile.email}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Contact Number</dt>
                     <dd className="text-sm font-medium">{profile.contactNumber ?? "-"}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Address</dt>
                     <dd className="text-sm font-medium">{profile.address ?? "-"}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Date of Birth</dt>
                     <dd className="text-sm font-medium">
                        {profile.dateOfBirth
                           ? new Date(profile.dateOfBirth).toLocaleDateString()
                           : "-"}
                     </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Gender</dt>
                     <dd className="text-sm font-medium">{profile.gender ?? "-"}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Program</dt>
                     <dd className="text-sm font-medium">{profile.program?.name ?? "-"}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                     <dt className="text-sm text-muted-foreground">Department</dt>
                     <dd className="text-sm font-medium">
                        {profile.program?.department.name ?? "-"}
                     </dd>
                  </div>
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
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                     />
                  </div>
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">Address</label>
                     <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                     />
                  </div>
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">
                        Date of Birth
                     </label>
                     <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                     />
                  </div>
                  <div>
                     <label className="mb-1 block text-sm text-muted-foreground">Gender</label>
                     <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as typeof gender)}
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                     >
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                     </select>
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
