"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ExternalLink } from "lucide-react";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingProvider?: "openai" | "gemini";
}

export function ApiKeyModal({
  open,
  onOpenChange,
  missingProvider,
}: ApiKeyModalProps) {
  const settings = useQuery(api.userSettings.get);
  const updateSettings = useMutation(api.userSettings.update);

  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      await updateSettings({
        ...(openaiKey && { openaiApiKey: openaiKey }),
        ...(geminiKey && { geminiApiKey: geminiKey }),
      });

      // Clear form
      setOpenaiKey("");
      setGeminiKey("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API keys");
    } finally {
      setSaving(false);
    }
  };

  const hasOpenAI =
    settings?.openaiApiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const hasGemini =
    settings?.geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Keys Setup</DialogTitle>
          <DialogDescription>
            Configure your AI provider API keys. Keys are stored securely and
            encrypted.
          </DialogDescription>
        </DialogHeader>

        {missingProvider && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">
                {missingProvider === "openai" ? "OpenAI" : "Gemini"} API key
                required
              </p>
              <p className="mt-1 text-xs">
                You selected{" "}
                {missingProvider === "openai" ? "ChatGPT" : "Gemini"} but don't
                have an API key configured. Please add your key below.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* OpenAI */}
          <div className="space-y-2">
            <Label htmlFor="openai-key">
              OpenAI API Key
              {hasOpenAI && (
                <span className="ml-2 text-xs text-green-600">
                  ✓ Configured
                </span>
              )}
            </Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your key at{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                platform.openai.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Gemini */}
          <div className="space-y-2">
            <Label htmlFor="gemini-key">
              Gemini API Key
              {hasGemini && (
                <span className="ml-2 text-xs text-green-600">
                  ✓ Configured
                </span>
              )}
            </Label>
            <Input
              id="gemini-key"
              type="password"
              placeholder="AI..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                aistudio.google.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || (!openaiKey && !geminiKey)}
          >
            {saving ? "Saving..." : "Save Keys"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
