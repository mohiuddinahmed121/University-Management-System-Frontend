import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../dashboard/dashboard-sidebar";
import Header from "../layout/public/Header";
import { ReactNode } from "react";
import { UserRole } from "@/types";

export default function DashboardShell({
   children,
   role,
}: {
   children: ReactNode;
   role: UserRole;
}) {
   return (
      <div className="flex min-h-svh flex-col">
         <div className="bg-background sticky top-0 z-20">
            <Header />
         </div>

         <SidebarProvider className="min-h-[calc(100svh-4rem)] flex-1">
            <DashboardSidebar role={role} />
            <SidebarInset>
               <div className="flex h-12 shrink-0 items-center border-b px-4">
                  <SidebarTrigger className="-ml-1" />
               </div>
               <div className="p-4">{children}</div>
            </SidebarInset>
         </SidebarProvider>
      </div>
   );
}
