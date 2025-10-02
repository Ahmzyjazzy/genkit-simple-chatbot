"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/lib/firebase";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "@/lib/firebase";

const queryClient = new QueryClient();

export default function WithFirebase({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    useEffect(() => {
        logEvent("screen_view", { firebase_screen: pathname });
    }, [pathname]);
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}