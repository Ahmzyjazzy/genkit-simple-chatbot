import { ai } from "@/common/genkit-beta";

import genkitEndpoint from "@/lib/genkit-endpoint";

export const POST = genkitEndpoint(({ system, messages, prompt }) => {
    const chat = ai.chat({ messages, system });
    return chat.sendStream({ prompt });
});
