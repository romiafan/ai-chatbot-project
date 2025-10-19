"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ProviderSelector } from "./ProviderSelector";
import { ModelSelector } from "./ModelSelector";
import { ProviderBadge } from "./ProviderBadge";
import { ApiKeyModal } from "./ApiKeyModal";
import { Loader2, AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../convex/_generated/dataModel";

export function ChatInterface() {
  const [currentConversationId, setCurrentConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [provider, setProvider] = useState<"openai" | "gemini">("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [missingKeyProvider, setMissingKeyProvider] = useState<
    "openai" | "gemini" | undefined
  >();

  // Query conversations, messages, and settings
  const conversations = useQuery(api.conversations.list);
  const messages = useQuery(
    api.messages.list,
    currentConversationId ? { conversationId: currentConversationId } : "skip"
  );
  const settings = useQuery(api.userSettings.get);

  // Mutations
  const createConversation = useMutation(api.conversations.create);
  const updateConversation = useMutation(api.conversations.update);
  const createMessage = useMutation(api.messages.create);

  // AI action
  const chat = useAction(api.ai.chat);

  // Auto-create first conversation
  useEffect(() => {
    if (conversations && conversations.length === 0) {
      createConversation({
        title: "New Conversation",
        provider,
        model,
        ragEnabled: false,
      }).then((id) => setCurrentConversationId(id));
    } else if (
      conversations &&
      conversations.length > 0 &&
      !currentConversationId
    ) {
      setCurrentConversationId(conversations[0]._id);
      setProvider(conversations[0].provider);
      setModel(conversations[0].model);
    }
  }, [
    conversations,
    currentConversationId,
    createConversation,
    provider,
    model,
  ]);

  // Check if provider has API key
  const hasApiKey = (providerToCheck: "openai" | "gemini"): boolean => {
    if (!settings) return false;

    if (providerToCheck === "openai") {
      return !!(
        settings.openaiApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY
      );
    } else {
      return !!(
        settings.geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY
      );
    }
  };

  // Handle provider/model changes
  const handleProviderChange = async (newProvider: "openai" | "gemini") => {
    // Check if provider has API key
    if (!hasApiKey(newProvider)) {
      setMissingKeyProvider(newProvider);
      setShowApiKeyModal(true);
      return;
    }

    setProvider(newProvider);

    // Set default model for provider
    const defaultModel =
      newProvider === "openai" ? "gpt-4o-mini" : "gemini-1.5-flash";
    setModel(defaultModel);

    // Update current conversation
    if (currentConversationId) {
      await updateConversation({
        id: currentConversationId,
        provider: newProvider,
        model: defaultModel,
      });
    }
  };

  const handleModelChange = async (newModel: string) => {
    setModel(newModel);

    // Update current conversation
    if (currentConversationId) {
      await updateConversation({
        id: currentConversationId,
        model: newModel,
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

    // Check if current provider has API key
    if (!hasApiKey(provider)) {
      setMissingKeyProvider(provider);
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create user message
      await createMessage({
        conversationId: currentConversationId,
        content,
        role: "user",
        provider,
        model,
      });

      // Call AI action to get response
      await chat({ conversationId: currentConversationId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
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
      {/* Header with provider/model selectors */}
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div className="flex items-center gap-3">
          <ProviderSelector
            value={provider}
            onChange={handleProviderChange}
            disabled={isLoading}
          />
          <ModelSelector
            provider={provider}
            value={model}
            onChange={handleModelChange}
            disabled={isLoading}
          />
          <ProviderBadge provider={provider} model={model} />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowApiKeyModal(true)}
          title="Configure API Keys"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages || []} isLoading={isLoading} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        open={showApiKeyModal}
        onOpenChange={setShowApiKeyModal}
        missingProvider={missingKeyProvider}
      />
    </div>
  );
}
