import Chat from "@/components/chat";
import { demoMetadata } from "@/lib/metadata";

export const generateMetadata = demoMetadata();

export default async function Page() {
  return (
    <div className="flex-1 min-w-[420px] h-screen relative overflow-hidden">
      <Chat endpoint="/api/simple-chatbot" />
    </div>
  );
}