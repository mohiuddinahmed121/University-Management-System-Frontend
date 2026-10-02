"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Header() {
   const routes = [
      { name: "Home", url: "/" },
      { name: "About us", url: "/about-us" },
   ];

   const dashboardRoute: Record<UserRole, string> = {
      ADMIN: "/admin",
      INSTRUCTOR: "/instructor",
      STUDENT: "/student",
   };

   const { data, isLoading } = useGetMe();
   const { mutate: logout } = useLogout();
   const queryClient = useQueryClient();

   const role = data?.data?.role as UserRole | undefined;

   const handleLogout = () => {
      logout(undefined, {
         onSuccess: () => {
            toast.add({
               title: "Logged out",
               description: "Logged out successfully",
               type: "success",
            });
            queryClient.removeQueries({ queryKey: ["user"] });
         },
         onError: () => {
            toast.add({
               title: "Logout failed",
               description: "Something went wrong",
               type: "error",
            });
         },
      });
   };

   return (
      <header className="h-16 w-full border-b">
         <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
               <Logo />
               <span>University Management System</span>
            </Link>

            <nav className="flex gap-5">
               {routes.map((route) => (
                  <Link key={route.url} href={route.url}>
                     {route.name}
                  </Link>
               ))}

               {role && dashboardRoute[role] && <Link href={dashboardRoute[role]}>Dashboard</Link>}
            </nav>

            <div>
               {!isLoading && !data && (
                  <Button
                     variant="outline"
                     render={<Link href="/login">Login</Link>}
                     nativeButton={false}
                  >
                     Login
                  </Button>
               )}

               {!isLoading && data && (
                  <Button onClick={handleLogout} variant="destructive">
                     Logout
                  </Button>
               )}
            </div>
         </div>
      </header>
   );
}
