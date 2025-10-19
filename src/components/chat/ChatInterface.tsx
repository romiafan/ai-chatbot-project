"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Loader2 } from "lucide-react";

export function ChatInterface() {
  const [currentConversationId, setCurrentConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Queries
  const conversations = useQuery(api.conversations.list);
  const messages = useQuery(
    api.messages.list,
    currentConversationId ? { conversationId: currentConversationId } : "skip"
  );

  // Mutations
  const createConversation = useMutation(api.conversations.create);
  const createMessage = useMutation(api.messages.create);

  // Action
  const chatAction = useAction(api.ai.chat);

  // Auto-select first conversation or create one
  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0]._id);
    } else if (
      conversations &&
      conversations.length === 0 &&
      !currentConversationId
    ) {
      // Create first conversation
      handleCreateConversation();
    }
  }, [conversations, currentConversationId]);

  const handleCreateConversation = async () => {
    try {
      const conversationId = await createConversation({
        title: "New Conversation",
        provider:
          (process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER as
            | "openai"
            | "gemini") || "gemini",
        model: process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || "gemini-1.5-flash",
        ragEnabled: false,
      });
      setCurrentConversationId(conversationId);
    } catch (err: any) {
      setError(err.message || "Failed to create conversation");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create user message
      await createMessage({
        conversationId: currentConversationId,
        content,
      });

      // Call AI action to get response
      await chatAction({
        conversationId: currentConversationId,
      });
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  if (conversations === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        {messages !== undefined ? (
          <MessageList messages={messages} isLoading={isLoading} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {error && (
        <div className="border-t bg-destructive/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={handleRetry}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="border-t p-4">
        <MessageInput
          onSend={handleSendMessage}
          disabled={isLoading || !currentConversationId}
        />
      </div>
    </div>
  );
}
