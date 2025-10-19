"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { Loader2 } from "lucide-react";

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

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Start a conversation</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Type a message below to begin chatting with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              AI is thinking...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
