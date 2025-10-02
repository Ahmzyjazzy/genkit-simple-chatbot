import { Metadata } from "next";

export function demoMetadata(): () => Promise<Metadata> {
    const demo = {
        id: "simple-chatbot",
        name: "Simple Chatbot",
        description:
            "A simple chatbot with streaming responses and a customizable system message.",
        tags: ["chat"],
        added: "2025-01-27",
        complexity: 1,
        files: [
            {
                name: "api/route.ts",
                combine: ["@/common/genkit-beta.ts", "api/route.ts"],
            },
        ],
    };

    return async function () {
        if (!demo) return {};
        return {
            title: demo.name,
            description: demo.description,
            openGraph: {
                images: [
                    `${process.env.SITE_ORIGIN || "http://localhost:3000"}/api/og?title=${demo.name
                    }`,
                ],
                description: demo.description,
                title: `Genkit - ${demo.name}`,
            },
        };
    };
}