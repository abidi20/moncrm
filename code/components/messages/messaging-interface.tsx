"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ContactsList } from "./contacts-list"
import { ChatWindow } from "./chat-window"
import { MessageHeader } from "./message-header"

export function MessagingInterface() {
  const [selectedContact, setSelectedContact] = useState<number | null>(1) // Marie Dubois par défaut

  return (
    <div className="space-y-6">
      <MessageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Liste des contacts */}
        <div className="lg:col-span-1">
          <Card className="h-full border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <ContactsList selectedContact={selectedContact} onSelectContact={setSelectedContact} />
          </Card>
        </div>

        {/* Fenêtre de chat */}
        <div className="lg:col-span-3">
          <Card className="h-full border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <ChatWindow selectedContact={selectedContact} />
          </Card>
        </div>
      </div>
    </div>
  )
}
