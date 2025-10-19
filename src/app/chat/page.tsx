"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)] w-full">
        <ChatInterface />
      </div>
    </MainLayout>
  );
}
