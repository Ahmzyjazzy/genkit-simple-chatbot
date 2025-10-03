import { ai } from "@/common/genkit-beta";

import genkitEndpoint from "@/lib/genkit-endpoint";

export const POST = genkitEndpoint(({ messages, prompt }) => {
    const chat = ai.chat({
        messages,
        system: 'You are a helpful assistant. Try to answer the user queries the best of your ability.',
    });
    return chat.sendStream({ prompt });
});
