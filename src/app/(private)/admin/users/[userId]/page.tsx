"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useGetSingleUser, useUpdateUserStatus } from "@/hooks";
import { useParams } from "next/navigation";

export default function AdminSingleUserPage() {
   const params = useParams<{ userId: string }>();
   const userId = params.userId;

   const { data, isLoading } = useGetSingleUser(userId);
   const { mutate: updateStatus, isPending } = useUpdateUserStatus();

   const user = data?.data;

   if (isLoading) {
      return <p className="text-muted-foreground">Loading...</p>;
   }

   if (!user) {
      return <p className="text-destructive">User not found</p>;
   }

   const handleToggleStatus = () => {
      updateStatus(
         { userId: user.id, payload: { status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" } },
         {
            onSuccess: () => {
               toast.add({ title: "Updated", description: "User status updated", type: "success" });
            },
            onError: () => {
               toast.add({
                  title: "Failed",
                  description: "Could not update status",
                  type: "error",
               });
            },
         },
      );
   };

   return (
      <Card className="max-w-2xl">
         <CardHeader>
            <CardTitle>{user.name}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-2 text-sm">
            <p>
               <span className="text-muted-foreground">Email:</span> {user.email}
            </p>
            <p>
               <span className="text-muted-foreground">Role:</span> {user.role}
            </p>
            <p>
               <span className="text-muted-foreground">Status:</span> {user.status}
            </p>
            <p>
               <span className="text-muted-foreground">Email Verified:</span>{" "}
               {user.emailVerified ? "Yes" : "No"}
            </p>

            {user.student && (
               <p>
                  <span className="text-muted-foreground">Student ID:</span>{" "}
                  {user.student.studentId} — {user.student.program?.name ?? "No Program"}
               </p>
            )}

            {user.instructor && (
               <p>
                  <span className="text-muted-foreground">Instructor ID:</span>{" "}
                  {user.instructor.instructorId} —{" "}
                  {user.instructor.department?.name ?? "No Department"}
               </p>
            )}

            {user.role !== "ADMIN" && (
               <Button
                  className="mt-4"
                  variant="outline"
                  disabled={isPending}
                  onClick={handleToggleStatus}
               >
                  {user.status === "ACTIVE" ? "Block User" : "Unblock User"}
               </Button>
            )}
         </CardContent>
      </Card>
   );
}
