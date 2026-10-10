"use client";

import { useState } from "react";
import { useGetAllInstructors, useApproveInstructor } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import type { IAdminInstructorListItem } from "@/types";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const statusBadgeClass: Record<string, string> = {
   PENDING: "bg-amber-100 text-amber-800",
   APPROVED: "bg-green-100 text-green-800",
   REJECTED: "bg-red-100 text-red-800",
};

const getInitials = (name: string) =>
   name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

export default function InstructorApplicationsPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
   const [rejectingId, setRejectingId] = useState<string | null>(null);
   const [rejectionReason, setRejectionReason] = useState("");

   const {
      data: response,
      isLoading,
      isError,
   } = useGetAllInstructors({
      searchTerm: searchTerm || undefined,
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
   });

   const {
      mutate: approve,
      isPending: approving,
      variables: approvingVars,
   } = useApproveInstructor();

   const allInstructors: IAdminInstructorListItem[] = response?.data ?? [];

   const instructors =
      statusFilter === "ALL"
         ? allInstructors
         : allInstructors.filter((i) => i.verificationStatus === statusFilter);

   const handleApprove = (instructor: IAdminInstructorListItem) => {
      approve(
         { instructorId: instructor.id, action: "APPROVE" },
         {
            onSuccess: (res) => {
               toast.add({
                  title: "Instructor Approved",
                  description: `${res.name} has been approved. A temporary password has been emailed.`,
                  type: "success",
               });
            },
            onError: (err) => {
               toast.add({
                  title: "Approval failed",
                  description: err.message || "Something went wrong. Please try again",
                  type: "error",
               });
            },
         },
      );
   };

   const openRejectForm = (instructor: IAdminInstructorListItem) => {
      setRejectingId(instructor.id);
      setRejectionReason("");
   };

   const cancelReject = () => {
      setRejectingId(null);
      setRejectionReason("");
   };

   const submitReject = (instructor: IAdminInstructorListItem) => {
      if (!rejectionReason.trim()) {
         toast.add({
            title: "Reason required",
            description: "Please provide a rejection reason",
            type: "error",
         });
         return;
      }

      approve(
         {
            instructorId: instructor.id,
            action: "REJECT",
            rejectionReason: rejectionReason.trim(),
         },
         {
            onSuccess: (res) => {
               toast.add({
                  title: "Application Rejected",
                  description: `${res.name}'s application has been rejected.`,
                  type: "success",
               });
               setRejectingId(null);
               setRejectionReason("");
            },
            onError: (err) => {
               toast.add({
                  title: "Rejection failed",
                  description: err.message || "Something went wrong. Please try again",
                  type: "error",
               });
            },
         },
      );
   };

   return (
      <div className="flex flex-col gap-5">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">Instructor Applications</h1>
            <p className="text-sm text-muted-foreground">
               Review, approve, or reject instructor applications
            </p>
         </div>

         <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
               {(["PENDING", "APPROVED", "REJECTED", "ALL"] as StatusFilter[]).map((status) => (
                  <button
                     key={status}
                     onClick={() => setStatusFilter(status)}
                     className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        statusFilter === status
                           ? "bg-primary text-primary-foreground"
                           : "bg-muted text-muted-foreground hover:bg-muted/70"
                     }`}
                  >
                     {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
               ))}
            </div>

            <Input
               placeholder="Search by name, email, or instructor ID"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="max-w-xs"
            />
         </div>

         {isLoading && (
            <div className="flex items-center justify-center py-12">
               <Spinner />
            </div>
         )}

         {isError && (
            <p className="py-8 text-center text-sm text-destructive">
               Failed to load instructor applications.
            </p>
         )}

         {!isLoading && !isError && instructors.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
               No instructor applications found.
            </p>
         )}

         {!isLoading && !isError && instructors.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
               <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                     <tr className="text-left">
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Instructor ID</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Name</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Email</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Department</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Designation</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">
                           Email Verified
                        </th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Resume</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Status</th>
                        <th className="whitespace-nowrap px-3 py-2.5 font-medium">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {instructors.map((instructor) => {
                        const isThisApproving =
                           approving && approvingVars?.instructorId === instructor.id;
                        const isRejectingThisRow = rejectingId === instructor.id;

                        return (
                           <tr key={instructor.id} className="border-t align-top">
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 {instructor.instructorId}
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 <div className="flex items-center gap-2">
                                    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium">
                                       {instructor.user?.imageUrl ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img
                                             src={instructor.user.imageUrl}
                                             alt={instructor.name}
                                             className="size-full object-cover"
                                          />
                                       ) : (
                                          getInitials(instructor.name)
                                       )}
                                    </div>
                                    {instructor.name}
                                 </div>
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{instructor.email}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 {instructor.department
                                    ? `${instructor.department.name} (${instructor.department.code})`
                                    : "-"}
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 {instructor.designation || "-"}
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 {instructor.user?.emailVerified ? (
                                    <span className="text-green-700">Verified</span>
                                 ) : (
                                    <span className="text-muted-foreground">Not verified</span>
                                 )}
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 {instructor.resumeUrl ? (
                                    <a
                                       href={instructor.resumeUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="font-medium text-primary underline underline-offset-4"
                                    >
                                       View
                                    </a>
                                 ) : (
                                    "-"
                                 )}
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                 <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                       statusBadgeClass[instructor.verificationStatus] ??
                                       "bg-muted text-muted-foreground"
                                    }`}
                                 >
                                    {instructor.verificationStatus}
                                 </span>
                              </td>
                              <td className="px-3 py-2.5">
                                 {instructor.verificationStatus === "PENDING" ? (
                                    isRejectingThisRow ? (
                                       <div className="flex min-w-[260px] flex-col gap-2">
                                          <Input
                                             placeholder="Reason for rejection"
                                             value={rejectionReason}
                                             onChange={(e) => setRejectionReason(e.target.value)}
                                          />
                                          <div className="flex gap-2">
                                             <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={approving}
                                                onClick={() => submitReject(instructor)}
                                             >
                                                {approving &&
                                                approvingVars?.instructorId === instructor.id ? (
                                                   <Spinner />
                                                ) : (
                                                   "Confirm Reject"
                                                )}
                                             </Button>
                                             <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={approving}
                                                onClick={cancelReject}
                                             >
                                                Cancel
                                             </Button>
                                          </div>
                                       </div>
                                    ) : (
                                       <div className="flex gap-2">
                                          <Button
                                             size="sm"
                                             disabled={approving}
                                             onClick={() => handleApprove(instructor)}
                                          >
                                             {isThisApproving ? <Spinner /> : "Approve"}
                                          </Button>
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             disabled={approving}
                                             onClick={() => openRejectForm(instructor)}
                                          >
                                             Reject
                                          </Button>
                                       </div>
                                    )
                                 ) : instructor.verificationStatus === "REJECTED" &&
                                   instructor.rejectionReason ? (
                                    <span className="text-xs text-muted-foreground">
                                       Reason: {instructor.rejectionReason}
                                    </span>
                                 ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                 )}
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
