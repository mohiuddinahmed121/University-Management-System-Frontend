"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useGetAllUsers, useUpdateUserStatus } from "@/hooks";
import type { IAdminUser, UserAccountStatus } from "@/types";
import Link from "next/link";
import { useState } from "react";

export default function AdminUsersPage() {
   const [page, setPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const [role, setRole] = useState("");
   const [status, setStatus] = useState("");

   const { data, isLoading } = useGetAllUsers({
      page,
      limit: 10,
      searchTerm: searchTerm || undefined,
      role: (role || undefined) as never,
      status: (status || undefined) as never,
   });

   const { mutate: updateStatus } = useUpdateUserStatus();
   //const users: IAdminUser[] = data?.data ?? [];
   const users = data?.data ?? [];
   const meta = data?.meta;

   const handleStatusChange = (userId: string, newStatus: UserAccountStatus) => {
      updateStatus(
         { userId, payload: { status: newStatus } },
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
      <div className="space-y-4">
         <div className="flex flex-wrap gap-3">
            <Input
               placeholder="Search by name or email"
               value={searchTerm}
               onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
               }}
               className="max-w-xs"
            />

            <select
               value={role}
               onChange={(e) => {
                  setRole(e.target.value);
                  setPage(1);
               }}
               className="rounded-md border px-3 py-2 text-sm"
            >
               <option value="">All Roles</option>
               <option value="STUDENT">Student</option>
               <option value="INSTRUCTOR">Instructor</option>
               <option value="ADMIN">Admin</option>
            </select>

            <select
               value={status}
               onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
               }}
               className="rounded-md border px-3 py-2 text-sm"
            >
               <option value="">All Status</option>
               <option value="ACTIVE">Active</option>
               <option value="BLOCKED">Blocked</option>
            </select>
         </div>

         <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
               <thead className="bg-muted/50 text-left">
                  <tr>
                     <th className="p-3">Name</th>
                     <th className="p-3">Email</th>
                     <th className="p-3">Role</th>
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

                  {!isLoading && users.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                           No users found
                        </td>
                     </tr>
                  )}

                  {users.map((user) => (
                     <tr key={user.id} className="border-t">
                        <td className="p-3">
                           <Link
                              href={`/admin/users/${user.id}`}
                              className="font-medium hover:underline"
                           >
                              {user.name}
                           </Link>
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.role}</td>
                        <td className="p-3">
                           <span
                              className={
                                 user.status === "ACTIVE" ? "text-green-600" : "text-destructive"
                              }
                           >
                              {user.status}
                           </span>
                        </td>
                        <td className="p-3">
                           {user.role !== "ADMIN" && (
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() =>
                                    handleStatusChange(
                                       user.id,
                                       user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                                    )
                                 }
                              >
                                 {user.status === "ACTIVE" ? "Block" : "Unblock"}
                              </Button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2">
               <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
               >
                  Previous
               </Button>
               <span className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
               </span>
               <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
               >
                  Next
               </Button>
            </div>
         )}
      </div>
   );
}
