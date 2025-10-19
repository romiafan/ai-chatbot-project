"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ModelConfig {
  id: string;
  name: string;
  contextWindow: number;
}

interface ModelSelectorProps {
  provider: "openai" | "gemini";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Model configurations
const models: Record<"openai" | "gemini", ModelConfig[]> = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000 },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000 },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", contextWindow: 128000 },
    { id: "gpt-4", name: "GPT-4", contextWindow: 8192 },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", contextWindow: 16385 },
  ],
  gemini: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", contextWindow: 1000000 },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      contextWindow: 1000000,
    },
  ],
};

export function ModelSelector({
  provider,
  value,
  onChange,
  disabled,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const availableModels = models[provider];
  const selectedModel = availableModels.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {selectedModel?.name ?? "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {availableModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === model.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.contextWindow.toLocaleString()} tokens
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
