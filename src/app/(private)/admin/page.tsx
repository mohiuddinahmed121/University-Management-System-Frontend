"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllUsers } from "@/hooks";

export default function AdminOverviewPage() {
   const { data: students } = useGetAllUsers({ role: "STUDENT", limit: 1 });
   const { data: instructors } = useGetAllUsers({ role: "INSTRUCTOR", limit: 1 });
   const { data: all } = useGetAllUsers({ limit: 1 });

   const stats = [
      { label: "Total Users", value: all?.meta?.total ?? "-" },
      { label: "Students", value: students?.meta?.total ?? "-" },
      { label: "Instructors", value: instructors?.meta?.total ?? "-" },
   ];

   return (
      <div className="grid gap-4 sm:grid-cols-3">
         {stats.map((stat) => (
            <Card key={stat.label}>
               <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-3xl font-semibold">{stat.value}</p>
               </CardContent>
            </Card>
         ))}
      </div>
   );
}
