"use client";

import { ReactNode } from "react";
import QueryProvider from "../providers/query.provider";
import GoogleAuthProvider from "../providers/google-auth.provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: ReactNode }) {
   return (
      <GoogleAuthProvider>
         <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
         </QueryProvider>
      </GoogleAuthProvider>
   );
}
