"use client";

import DemoConfig from "@/lib/demo-config";
import { useState } from "react";

export default function DemoContext({ children }: { children: React.ReactNode }) {
    "use client";
    const [config, setConfig] = useState<Record<string, any>>({});
    return <DemoConfig.Provider value={{ config, setConfig }}>{children}</DemoConfig.Provider>;
}