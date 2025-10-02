import { createContext } from "react";

const Config = createContext<{
    config?: Record<string, unknown>;
    setConfig?: (newConfig: Record<string, unknown>) => void;
}>({});

export default Config;