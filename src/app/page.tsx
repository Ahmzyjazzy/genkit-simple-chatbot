import Chat from "@/components/chat";
import DemoContext from "@/components/demo-config";
import { demoMetadata } from "@/lib/demo-metadata";

export const generateMetadata = demoMetadata();

export default async function Page() {
  return (
    <DemoContext>
      <div className="flex-1 min-w-[420px] h-screen relative overflow-hidden">
        <Chat endpoint="/api/simple-chatbot" />
      </div>
    </DemoContext>
  );
}