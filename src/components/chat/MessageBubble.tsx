"use client";

import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  role: "user" | "assistant" | "system";
  content: string;
  provider: string;
  model?: string;
  createdAt: number;
  citations?: Array<{
    fileId: string;
    fileName: string;
    chunkIndex: number;
    relevanceScore: number;
  }>;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.citations.map((citation, index) => (
              <div
                key={`${citation.fileId}-${citation.chunkIndex}`}
                className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {citation.fileName} (chunk {citation.chunkIndex})
              </div>
            ))}
          </div>
        )}

        {/* Model info for assistant messages */}
        {!isUser && message.model && (
          <div className="text-xs text-muted-foreground">
            {message.provider} • {message.model}
          </div>
        )}
      </div>
    </div>
  );
}
