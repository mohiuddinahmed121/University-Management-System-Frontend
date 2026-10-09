// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useGetSingleRegistration } from "@/hooks";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";

// const statusBadgeClass: Record<string, string> = {
//    REGISTERED: "bg-green-100 text-green-800",
//    DROPPED: "bg-red-100 text-red-800",
//    COMPLETED: "bg-blue-100 text-blue-800",
// };

// export default function RegistrationDetailPage() {
//    const router = useRouter();
//    const params = useParams<{ registrationId: string }>();
//    const registrationId = params.registrationId;

//    const { data: response, isLoading, isError } = useGetSingleRegistration(registrationId);
//    const registration = response?.data;

//    if (isLoading) {
//       return (
//          <div className="flex items-center justify-center py-12">
//             <Spinner />
//          </div>
//       );
//    }

//    if (isError || !registration) {
//       return (
//          <div className="flex flex-col gap-4">
//             <p className="py-8 text-center text-sm text-destructive">
//                Failed to load registration details.
//             </p>
//             <Button variant="outline" onClick={() => router.back()}>
//                Go back
//             </Button>
//          </div>
//       );
//    }

//    return (
//       <div className="flex flex-col gap-5">
//          <div className="flex items-center justify-between">
//             <div>
//                <h1 className="text-2xl font-bold tracking-tight">Registration Details</h1>
//                <p className="text-sm text-muted-foreground">
//                   {registration.section.course.code} — {registration.section.course.title}
//                </p>
//             </div>
//             <Button variant="outline" onClick={() => router.back()}>
//                Back
//             </Button>
//          </div>

//          <div className="grid gap-4 sm:grid-cols-2">
//             <div className="rounded-lg border p-4">
//                <h2 className="mb-3 font-semibold">Student</h2>
//                <dl className="flex flex-col gap-2 text-sm">
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Student ID</dt>
//                      <dd className="font-medium">{registration.student?.studentId ?? "-"}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Name</dt>
//                      <dd className="font-medium">{registration.student?.name ?? "-"}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Email</dt>
//                      <dd className="font-medium">{registration.student?.email ?? "-"}</dd>
//                   </div>
//                </dl>
//             </div>

//             <div className="rounded-lg border p-4">
//                <h2 className="mb-3 font-semibold">Course / Section</h2>
//                <dl className="flex flex-col gap-2 text-sm">
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Course</dt>
//                      <dd className="font-medium">
//                         {registration.section.course.code} — {registration.section.course.title}
//                      </dd>
//                   </div>
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Section</dt>
//                      <dd className="font-medium">{registration.section.sectionName}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Semester</dt>
//                      <dd className="font-medium">
//                         {registration.section.semester.name} {registration.section.semester.year}
//                      </dd>
//                   </div>
//                </dl>
//             </div>

//             <div className="rounded-lg border p-4">
//                <h2 className="mb-3 font-semibold">Registration Status</h2>
//                <dl className="flex flex-col gap-2 text-sm">
//                   <div className="flex items-center justify-between">
//                      <dt className="text-muted-foreground">Status</dt>
//                      <dd>
//                         <span
//                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
//                               statusBadgeClass[registration.status] ??
//                               "bg-muted text-muted-foreground"
//                            }`}
//                         >
//                            {registration.status}
//                         </span>
//                      </dd>
//                   </div>
//                   <div className="flex justify-between">
//                      <dt className="text-muted-foreground">Registered At</dt>
//                      <dd className="font-medium">
//                         {new Date(registration.registeredAt).toLocaleDateString()}
//                      </dd>
//                   </div>
//                   {registration.droppedAt && (
//                      <div className="flex justify-between">
//                         <dt className="text-muted-foreground">Dropped At</dt>
//                         <dd className="font-medium">
//                            {new Date(registration.droppedAt).toLocaleDateString()}
//                         </dd>
//                      </div>
//                   )}
//                </dl>
//             </div>

//             <div className="rounded-lg border p-4">
//                <h2 className="mb-3 font-semibold">Result</h2>
//                {registration.result ? (
//                   <dl className="flex flex-col gap-2 text-sm">
//                      <div className="flex justify-between">
//                         <dt className="text-muted-foreground">Grade</dt>
//                         <dd className="font-medium">{registration.result.grade ?? "-"}</dd>
//                      </div>
//                      <div className="flex justify-between">
//                         <dt className="text-muted-foreground">GPA</dt>
//                         <dd className="font-medium">
//                            {registration.result.gpa !== null &&
//                            registration.result.gpa !== undefined
//                               ? registration.result.gpa.toFixed(2)
//                               : "-"}
//                         </dd>
//                      </div>
//                   </dl>
//                ) : (
//                   <p className="text-sm text-muted-foreground">No result submitted yet.</p>
//                )}
//             </div>
//          </div>
//       </div>
//    );
// }

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

   return (
      <div className="flex flex-col gap-5">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight">Registration Details</h1>
               <p className="text-sm text-muted-foreground">
                  {registration.section.course.code} — {registration.section.course.title}
               </p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
               Back
            </Button>
         </div>

         <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
               <h2 className="mb-3 font-semibold">Student</h2>
               <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Student ID</dt>
                     <dd className="font-medium">{registration.student?.studentId ?? "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Name</dt>
                     <dd className="font-medium">{registration.student?.name ?? "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Email</dt>
                     <dd className="font-medium">{registration.student?.email ?? "-"}</dd>
                  </div>
               </dl>
            </div>

            <div className="rounded-lg border p-4">
               <h2 className="mb-3 font-semibold">Course / Section</h2>
               <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Course</dt>
                     <dd className="font-medium">
                        {registration.section.course.code} — {registration.section.course.title}
                     </dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Section</dt>
                     <dd className="font-medium">{registration.section.sectionName}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Semester</dt>
                     <dd className="font-medium">
                        {registration.section.semester.name} {registration.section.semester.year}
                     </dd>
                  </div>
               </dl>
            </div>

            <div className="rounded-lg border p-4">
               <h2 className="mb-3 font-semibold">Registration Status</h2>
               <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                     <dt className="text-muted-foreground">Status</dt>
                     <dd>
                        <span
                           className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              statusBadgeClass[registration.status] ??
                              "bg-muted text-muted-foreground"
                           }`}
                        >
                           {registration.status}
                        </span>
                     </dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-muted-foreground">Registered At</dt>
                     <dd className="font-medium">
                        {new Date(registration.registeredAt).toLocaleDateString()}
                     </dd>
                  </div>
                  {registration.droppedAt && (
                     <div className="flex justify-between">
                        <dt className="text-muted-foreground">Dropped At</dt>
                        <dd className="font-medium">
                           {new Date(registration.droppedAt).toLocaleDateString()}
                        </dd>
                     </div>
                  )}
               </dl>
            </div>

            <div className="rounded-lg border p-4">
               <h2 className="mb-3 font-semibold">Result</h2>

               {registration.status === "DROPPED" ? (
                  <p className="text-sm text-muted-foreground">
                     This registration was dropped. Result cannot be submitted.
                  </p>
               ) : registration.result && !isEditingResult ? (
                  <div className="flex flex-col gap-3">
                     <dl className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                           <dt className="text-muted-foreground">Marks</dt>
                           <dd className="font-medium">{registration.result.marks}</dd>
                        </div>
                        <div className="flex justify-between">
                           <dt className="text-muted-foreground">Grade</dt>
                           <dd className="font-medium">{registration.result.grade}</dd>
                        </div>
                        <div className="flex justify-between">
                           <dt className="text-muted-foreground">Grade Point</dt>
                           <dd className="font-medium">
                              {registration.result.gradePoint.toFixed(2)}
                           </dd>
                        </div>
                        <div className="flex justify-between">
                           <dt className="text-muted-foreground">Submitted At</dt>
                           <dd className="font-medium">
                              {new Date(registration.result.submittedAt).toLocaleDateString()}
                           </dd>
                        </div>
                     </dl>
                     <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                           setMarks(String(registration.result!.marks));
                           setIsEditingResult(true);
                        }}
                     >
                        Edit Result
                     </Button>
                  </div>
               ) : registration.result && isEditingResult ? (
                  <div className="flex flex-col gap-3">
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
                  <div className="flex flex-col gap-3">
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
      </div>
   );
}
