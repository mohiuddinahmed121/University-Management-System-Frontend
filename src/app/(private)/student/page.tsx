"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMe, useGetMyRegistrations } from "@/hooks";

export default function StudentOverviewPage() {
   const { data: me } = useGetMe();
   const { data: registrations } = useGetMyRegistrations({ status: "REGISTERED", limit: 1 });

   const student = me?.data?.student;

   const stats = [
      { label: "Active Courses", value: registrations?.meta?.total ?? "-" },
      { label: "Program", value: student?.program?.name ?? "Not Set" },
      { label: "Student ID", value: student?.studentId ?? "-" },
   ];

   return (
      <div className="grid gap-4 sm:grid-cols-3">
         {stats.map((stat) => (
            <Card key={stat.label}>
               <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-xl font-semibold">{stat.value}</p>
               </CardContent>
            </Card>
         ))}
      </div>
   );
}
