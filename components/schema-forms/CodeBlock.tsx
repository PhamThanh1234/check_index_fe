// components/CodeBlock.tsx
"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Paper } from "@mantine/core";

type CodeBlockProps = {
  code: string;
  language: string;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <Paper withBorder radius="md" p="sm" bg="gray.0">
      <SyntaxHighlighter language={language} style={oneLight} wrapLongLines>
        {code}
      </SyntaxHighlighter>
    </Paper>
  );
}
