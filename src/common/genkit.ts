import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

const ai = genkit({
    plugins: [googleAI()], // set the GOOGLE_API_KEY env variable
    model: googleAI.model('gemini-2.0-flash'),
});

export { ai, z };