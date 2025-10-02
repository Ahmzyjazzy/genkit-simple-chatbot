import { createContext } from "react";

const DemoConfig = createContext<{
    config?: Record<string, unknown>;
    setConfig?: (newConfig: Record<string, unknown>) => void;
}>({});
export default DemoConfig;