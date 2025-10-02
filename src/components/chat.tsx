"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Code, RefreshCcw, Send, Sparkle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import DemoConfig from "@/lib/demo-config";
import useAgent from "@/lib/use-agent";
import type { MessageData, Part, Role } from "genkit";
import CodeBlock from "./code-block";

export interface PartRender {
    (part: Part, info: PartRenderInfo): React.ReactNode | null;
}

export interface PartRenderInfo {
    partIndex: number;
    message: MessageData;
    messageIndex: number;
    messages: MessageData[];
}

function TextPart({ role, text }: { role: Role; text: string }) {
    if (text.trim() === "") return <></>;
    return (
        <div
            className={cn(
                "rounded-lg px-4 py-2 max-w-[85%] mb-4", // Allow messages to take up more width
                role === "user"
                    ? "bg-zinc-800 border-2 border-zinc-600 text-white ml-auto rounded-tr-none" // User message style, right-aligned
                    : "bg-black border-2 border-zinc-700 text-white rounded-tl-none" // Assistant message style, left-aligned
            )}
        >
            <Markdown className="prose prose-sm prose-invert">{text}</Markdown>
        </div>
    );
}

export default function Chat({
    endpoint,
    agent,
    renderPart: customRenderPart,
    data,
}: {
    agent?: ReturnType<typeof useAgent>;
    endpoint?: string;
    renderPart?: PartRender;
    data?: Record<string, any>;
}) {
    const renderPart: PartRender = (part, info: PartRenderInfo) => {
        const custom = customRenderPart?.(part, info) || null;
        if (custom !== null) return custom;
        if (part.text)
            return <TextPart role={info.message.role} text={part.text} />;
    };

    const { config } = useContext(DemoConfig);
    const { messages, resetConversation, error, isLoading, send } =
        agent ||
        useAgent({
            endpoint: endpoint!,
        });

    const [input, setInput] = useState("");
    const [viewSource, setViewSource] = useState(false);
    const bottomOfChat = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        return send({
            system: config?.system,
            messages,
            prompt: [{ text: input }],
            ...data,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent newline in the input
            if (isLoading) return;
            handleSend();
            setInput("");
        }
    };

    const ChatContent = () => {
        return (
            <>
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={cn(
                            "flex flex-col", // Align items to the start
                            message.role === "user" ? "items-end" : "items-start"
                        )}
                    >
                        {message.content.map((p, i) => (
                            <React.Fragment key={i}>
                                {renderPart(p, {
                                    message,
                                    messageIndex: index,
                                    partIndex: i,
                                    messages,
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
                {isLoading && ( //Display loading indicator
                    <div className="flex justify-start my-2">
                        <div className="flex items-center animate-pulse text-sm">
                            <Sparkle className="w-3 h-3 mr-1" /> Thinking&hellip;
                        </div>
                    </div>
                )}
                {error && (
                    <div className="rounded-lg py-2 px-3 mx-12 my-4 border border-red-300 text-red-100">
                        {error.message}
                    </div>
                )}
                <div ref={bottomOfChat} />
            </>
        );
    };

    const ChatSource = () => {
        return (
            <>
                <h1 className="text-right text-xl font-semibold p-2">
                    Raw Message History
                </h1>
                <CodeBlock source={JSON.stringify(messages, null, 2)} />
            </>
        );
    };

    return (
        <div className="flex flex-col h-full max-w-screen-sm mx-auto relative overflow-hidden">
            <ScrollArea className="flex-1 p-4 pt-6 overflow-y-auto">
                {viewSource ? <ChatSource /> : <ChatContent />}
            </ScrollArea>

            <div className="p-4 border-t border-gray-200 flex items-center">
                <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} // Handle Enter key
                    className="mr-2"
                    disabled={isLoading}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (isLoading) return;
                        handleSend();
                        inputRef.current?.focus();
                    }}
                    disabled={isLoading}
                >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>

            <div className="absolute top-4 left-2">
                <Button
                    variant="outline"
                    size="icon"
                    title="View Raw Output"
                    onClick={() => {
                        setViewSource((cur) => !cur);
                    }}
                >
                    <Code />
                </Button>
                {messages.length > 0 && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="m-2"
                        title="Reset Conversation"
                        onClick={() => {
                            resetConversation();
                            inputRef.current?.focus();
                        }}
                    >
                        <RefreshCcw />
                    </Button>
                )}
            </div>
        </div>
    );
}