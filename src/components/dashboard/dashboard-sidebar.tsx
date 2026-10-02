"use client";

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/assets/svg/Logo";
import { UserRole } from "@/types";
import { SidebarItems } from "@/types/sidebar.type";
import { adminRoutes, instructorRoutes, studentRoutes } from "@/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
   ADMIN: adminRoutes,
   INSTRUCTOR: instructorRoutes,
   STUDENT: studentRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
   const pathname = usePathname();
   const routes: SidebarItems = sidebarRoutes[role] || [];

   return (
      <Sidebar>
         <SidebarHeader>
            <Link href="/">
               <div className="flex items-center gap-2">
                  <Logo />
                  <span>University Management System</span>
               </div>
            </Link>
         </SidebarHeader>

         <SidebarContent>
            {routes.map((group) => (
               <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {group.items.map((item) => (
                           <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                 render={<Link href={item.url} />}
                                 isActive={pathname === item.url}
                              >
                                 {item.title}
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ))}
         </SidebarContent>

         <SidebarRail />
      </Sidebar>
   );
}
