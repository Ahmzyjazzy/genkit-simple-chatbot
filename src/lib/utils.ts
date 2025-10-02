import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { GenerateStreamResponse, MessageData, Part } from "genkit";
import { GenerateResponseChunkData } from "genkit/model";
import { auth, logEvent } from "./firebase";
import { getIdToken } from "firebase/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toReadableStream(
  response: GenerateStreamResponse,
  options?: {
    transform?: (chunk: GenerateResponseChunkData & { output: unknown }) => any;
    errorRef?: { current?: { message: string } };
  }
) {
  return new ReadableStream({
    async start(controller) {
      function enqueue(data: any) {
        const out = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(out);
      }

      try {
        for await (const chunk of response.stream) {
          enqueue({
            message: options?.transform
              ? options.transform(chunk)
              : { ...chunk.toJSON(), output: chunk.output },
          });
        }

        const result = await response.response;
        console.dir(result.messages, { depth: null });

        enqueue({
          result: {
            messages: [...result.messages],
            output: result.output,
          },
        });
      } catch (e) {
        console.error((e as Error).stack);
        enqueue({ error: { message: (e as Error).message } });
      } finally {
        setTimeout(() => {
          controller.close();
        }, 100);
      }
    },
  });
}

export async function simplePost<ReqData = unknown, ResultData = unknown>(
  path: string,
  data: ReqData
): Promise<ResultData> {
  let token: string | undefined;
  if (auth.currentUser) {
    token = await getIdToken(auth.currentUser!);
  }
  if (!token) throw new Error("Must be authenticated to make API calls.");

  logEvent("demo_api_call", { path });
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.headers.get("content-type") === "application/json") {
      const error = await response.json();
      throw new Error(error.message);
    }
    throw new Error(
      `Unexpected HTTP error: ${(await response.text()).substring(0, 200)}`
    );
  }

  return await response.json();
}

export async function* post<
  ReqData = unknown,
  ChunkData = unknown,
  ResultData = unknown
>(
  path: string,
  data: ReqData
): AsyncIterable<{
  message?: ChunkData;
  result?: ResultData;
  error?: { message: string; status?: number };
}> {
  let token: string | undefined;
  if (auth.currentUser) {
    token = await getIdToken(auth.currentUser!);
  }
  if (!token) throw new Error("Must be authenticated to make API calls.");

  logEvent("demo_api_call", { path });
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.headers.get("content-type") === "application/json") {
      const error = await response.json();
      yield { error };
      return;
    }
    yield {
      error: {
        message: `Unexpected HTTP error: ${(await response.text()).substring(
          0,
          200
        )}`,
        status: response.status,
      },
    };
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body to read");
  }

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += new TextDecoder().decode(value);
    const lines = buffer.split("\n\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line.startsWith("data: ")) {
        const jsonStr = line.substring("data: ".length);
        try {
          const chunk = JSON.parse(jsonStr);
          yield chunk; // Assuming the actual data is under the "message" key
        } catch (error) {
          console.error("Failed to parse JSON chunk:", jsonStr, error);
        }
      }
    }
    buffer = lines[lines.length - 1];
  }
}

export function applyChunk(
  chunk: GenerateResponseChunkData,
  setter: (handler: (messages: MessageData[]) => MessageData[]) => void
) {
  setter((messages) => {
    const out = [...messages];
    const existingParts = out[chunk.index!]?.content || [];
    out.splice(chunk.index!, 1, {
      role: chunk.role!,
      content: [...existingParts, ...chunk.content],
    });
    return out;
  });
}

export function compactParts(parts: Part[]): Part[] {
  const out: Part[] = [];
  for (const part of parts) {
    const lastPart = out.at(-1);
    if (lastPart?.text && part.text) lastPart.text += part.text;
    else out.push(part);
  }
  return out;
}