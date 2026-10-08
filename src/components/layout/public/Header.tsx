// "use client";

// import Logo from "@/assets/svg/Logo";
// import { Button } from "@/components/ui/button";
// import { useGetMe, useLogoutHandler } from "@/hooks";
// import { UserRole } from "@/types";
// import Link from "next/link";

// const routes = [
//    { name: "Home", url: "/" },
//    { name: "About us", url: "/about-us" },
// ];

// const dashboardRoute: Record<UserRole, string> = {
//    ADMIN: "/admin",
//    INSTRUCTOR: "/instructor",
//    STUDENT: "/student",
// };

// export default function Header() {
//    const { data, isLoading } = useGetMe();
//    const { handleLogout } = useLogoutHandler();

//    const role = data?.data?.role as UserRole | undefined;

//    return (
//       <header className="h-16 w-full border-b">
//          <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
//             <Link href="/" className="flex items-center gap-2">
//                <Logo />
//                <span>University Management System</span>
//             </Link>

//             <nav className="flex gap-5">
//                {routes.map((route) => (
//                   <Link key={route.url} href={route.url}>
//                      {route.name}
//                   </Link>
//                ))}
//                {role && dashboardRoute[role] && <Link href={dashboardRoute[role]}>Dashboard</Link>}
//             </nav>

//             <div>
//                {!isLoading && !data && (
//                   <Button
//                      variant="outline"
//                      render={<Link href="/login">Login</Link>}
//                      nativeButton={false}
//                   >
//                      Login
//                   </Button>
//                )}
//                {!isLoading && data && (
//                   <Button onClick={handleLogout} variant="destructive">
//                      Logout
//                   </Button>
//                )}
//             </div>
//          </div>
//       </header>
//    );
// }

"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { useGetMe, useLogoutHandler } from "@/hooks";
import { UserRole } from "@/types";
import Link from "next/link";

const publicRoutes = [
   { name: "Home", url: "/" },
   { name: "About us", url: "/about-us" },
];

const dashboardRoute: Record<UserRole, string> = {
   ADMIN: "/admin",
   INSTRUCTOR: "/instructor",
   STUDENT: "/student",
};

export default function Header() {
   const { data, isLoading } = useGetMe();
   const { handleLogout } = useLogoutHandler();

   const role = data?.data?.role as UserRole | undefined;

   const dashboardUrl = role ? dashboardRoute[role] : undefined;

   return (
      <header className="h-16 w-full border-b bg-background">
         <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
               <Logo />
               <span className="font-semibold">University Management System</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
               {publicRoutes.map((route) => (
                  <Link
                     key={route.url}
                     href={route.url}
                     className="text-sm font-medium transition-colors hover:text-primary"
                  >
                     {route.name}
                  </Link>
               ))}

               {/* Show only when user is logged in */}
               {dashboardUrl && (
                  <Link
                     href={dashboardUrl}
                     className="text-sm font-medium transition-colors hover:text-primary"
                  >
                     Dashboard
                  </Link>
               )}
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-2">
               {!isLoading && !data && (
                  <>
                     <Button
                        variant="ghost"
                        render={<Link href="/register" />}
                        nativeButton={false}
                     >
                        Register
                     </Button>

                     <Button variant="outline" render={<Link href="/apply" />} nativeButton={false}>
                        Apply as Instructor
                     </Button>

                     <Button render={<Link href="/login" />} nativeButton={false}>
                        Login
                     </Button>
                  </>
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
