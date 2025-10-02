import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
    source,
    language,
}: {
    source: string;
    language?: string;
}) {
    return (
        <SyntaxHighlighter
            language={language || "javascript"}
            wrapLongLines={true}
            style={theme}
            customStyle={{ fontSize: "12px", width: "100%", whiteSpace: "pre-wrap" }}
            codeTagProps={{ style: { whiteSpace: "pre-wrap" } }}
        >
            {source}
        </SyntaxHighlighter>
    );
}