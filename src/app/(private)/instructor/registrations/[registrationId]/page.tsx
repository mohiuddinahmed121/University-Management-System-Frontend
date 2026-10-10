"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleRegistration, useSubmitResult, useUpdateResult } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

const statusBadgeClass: Record<string, string> = {
   REGISTERED: "bg-green-100 text-green-800",
   DROPPED: "bg-red-100 text-red-800",
   COMPLETED: "bg-blue-100 text-blue-800",
};

const formatGradePoint = (gradePoint: string | number | null | undefined) => {
   if (gradePoint === null || gradePoint === undefined) return "-";
   const num = Number(gradePoint);
   return Number.isNaN(num) ? "-" : num.toFixed(2);
};

const getInitials = (name: string) =>
   name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

export default function RegistrationDetailPage() {
   const router = useRouter();
   const params = useParams<{ registrationId: string }>();
   const registrationId = params.registrationId;

   const { data: response, isLoading, isError } = useGetSingleRegistration(registrationId);
   const registration = response?.data;

   const [marks, setMarks] = useState("");
   const [isEditingResult, setIsEditingResult] = useState(false);

   const { mutate: submitResult, isPending: isSubmitting } = useSubmitResult();
   const { mutate: updateResult, isPending: isUpdating } = useUpdateResult();

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-12">
            <Spinner />
         </div>
      );
   }

   if (isError || !registration) {
      return (
         <div className="flex flex-col gap-4">
            <p className="py-8 text-center text-sm text-destructive">
               Failed to load registration details.
            </p>
            <Button variant="outline" onClick={() => router.back()}>
               Go back
            </Button>
         </div>
      );
   }

   const handleSubmitResult = () => {
      const marksNum = Number(marks);

      if (Number.isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
         toast.add({
            title: "Invalid marks",
            description: "Marks must be a number between 0 and 100",
            type: "error",
         });
         return;
      }

      submitResult(
         { registrationId: registration.id, marks: marksNum },
         {
            onSuccess: () => {
               toast.add({
                  title: "Result Submitted",
                  description: "Result has been submitted successfully",
                  type: "success",
               });
               setMarks("");
            },
            onError: (err) => {
               toast.add({
                  title: "Submission failed",
                  description: err.message || "Something went wrong. Please try again",
                  type: "error",
               });
            },
         },
      );
   };

   const handleUpdateResult = () => {
      if (!registration.result) return;

      const marksNum = Number(marks);

      if (Number.isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
         toast.add({
            title: "Invalid marks",
            description: "Marks must be a number between 0 and 100",
            type: "error",
         });
         return;
      }

      updateResult(
         { resultId: registration.result.id, payload: { marks: marksNum } },
         {
            onSuccess: () => {
               toast.add({
                  title: "Result Updated",
                  description: "Result has been updated successfully",
                  type: "success",
               });
               setIsEditingResult(false);
               setMarks("");
            },
            onError: (err) => {
               toast.add({
                  title: "Update failed",
                  description: err.message || "Something went wrong. Please try again",
                  type: "error",
               });
            },
         },
      );
   };

   const studentName = registration.student?.name ?? "Unknown Student";

   return (
      <div className="flex flex-col gap-5">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Student Record</h1>
            <Button variant="outline" onClick={() => router.back()}>
               Back
            </Button>
         </div>

         {/* Student profile header */}
         <div className="flex flex-wrap items-center gap-4 rounded-lg border p-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
               {getInitials(studentName)}
            </div>
            <div className="flex-1">
               <h2 className="text-lg font-semibold">{studentName}</h2>
               <p className="text-sm text-muted-foreground">
                  {registration.student?.studentId ?? "-"} · {registration.student?.email ?? "-"}
               </p>
            </div>
            <span
               className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusBadgeClass[registration.status] ?? "bg-muted text-muted-foreground"
               }`}
            >
               {registration.status}
            </span>
         </div>

         {/* Academic record / history timeline */}
         <div className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Academic Record</h2>

            <div className="flex flex-col gap-4 border-l-2 border-muted pl-4">
               {/* Course/Section */}
               <div className="relative">
                  <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary" />
                  <p className="text-sm font-medium">
                     {registration.section.course.code} — {registration.section.course.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                     Section {registration.section.sectionName} ·{" "}
                     {registration.section.semester.name} {registration.section.semester.year}
                  </p>
               </div>

               {/* Registered */}
               <div className="relative">
                  <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-green-500" />
                  <p className="text-sm font-medium">Registered</p>
                  <p className="text-xs text-muted-foreground">
                     {new Date(registration.registeredAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                     })}
                  </p>
               </div>

               {/* Dropped */}
               {registration.droppedAt && (
                  <div className="relative">
                     <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-red-500" />
                     <p className="text-sm font-medium">Dropped</p>
                     <p className="text-xs text-muted-foreground">
                        {new Date(registration.droppedAt).toLocaleDateString(undefined, {
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        })}
                     </p>
                  </div>
               )}

               {/* Result */}
               {registration.result && (
                  <div className="relative">
                     <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-blue-500" />
                     <p className="text-sm font-medium">Result Submitted</p>
                     <p className="text-xs text-muted-foreground">
                        {new Date(registration.result.submittedAt).toLocaleDateString(undefined, {
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        })}
                     </p>
                  </div>
               )}
            </div>
         </div>

         {/* Result detail + submit/update form */}
         <div className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Result</h2>

            {registration.status === "DROPPED" ? (
               <p className="text-sm text-muted-foreground">
                  This registration was dropped. Result cannot be submitted.
               </p>
            ) : registration.result && !isEditingResult ? (
               <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4 sm:max-w-md">
                     <div className="rounded-md bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Marks</p>
                        <p className="mt-1 text-lg font-semibold">{registration.result.marks}</p>
                     </div>
                     <div className="rounded-md bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <p className="mt-1 text-lg font-semibold">{registration.result.grade}</p>
                     </div>
                     <div className="rounded-md bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Grade Point</p>
                        <p className="mt-1 text-lg font-semibold">
                           {formatGradePoint(registration.result.gradePoint)}
                        </p>
                     </div>
                  </div>
                  <Button
                     size="sm"
                     variant="outline"
                     className="w-fit"
                     onClick={() => {
                        setMarks(String(registration.result!.marks));
                        setIsEditingResult(true);
                     }}
                  >
                     Edit Result
                  </Button>
               </div>
            ) : registration.result && isEditingResult ? (
               <div className="flex max-w-sm flex-col gap-3">
                  <Input
                     type="number"
                     min={0}
                     max={100}
                     placeholder="Marks (0-100)"
                     value={marks}
                     onChange={(e) => setMarks(e.target.value)}
                  />
                  <div className="flex gap-2">
                     <Button size="sm" disabled={isUpdating} onClick={handleUpdateResult}>
                        {isUpdating ? <Spinner /> : "Save"}
                     </Button>
                     <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => {
                           setIsEditingResult(false);
                           setMarks("");
                        }}
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
            ) : (
               <div className="flex max-w-sm flex-col gap-3">
                  <p className="text-sm text-muted-foreground">No result submitted yet.</p>
                  <Input
                     type="number"
                     min={0}
                     max={100}
                     placeholder="Marks (0-100)"
                     value={marks}
                     onChange={(e) => setMarks(e.target.value)}
                  />
                  <Button
                     size="sm"
                     disabled={isSubmitting}
                     onClick={handleSubmitResult}
                     className="w-fit"
                  >
                     {isSubmitting ? <Spinner /> : "Submit Result"}
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
}
