"use client";

import { useGetMe } from "@/hooks";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import AccessDenied from "../auth/access-denied";
import AuthLoading from "../auth/auth-loading";

interface IProps {
   children: ReactNode;
   roles: UserRole[];
}

export default function RoleGuard({ children, roles }: IProps) {
   const router = useRouter();

   const { data, isPending, isError } = useGetMe();

   const user = data?.data;

   const isAuthorized = !!user && roles.includes(user.role);

   useEffect(() => {
      if (isPending) {
         return;
      }

      if (isError || !user) {
         router.replace("/login");
      }
   }, [isPending, isError, user, router]);

   if (isPending) {
      return <AuthLoading />;
   }

   if (isError || !user) {
      return <AuthLoading label="Redirecting..." />;
   }

   if (isAuthorized) {
      return <>{children}</>;
   }

   return <AccessDenied />;
}
