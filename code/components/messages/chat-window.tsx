"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, Video, MoreHorizontal, Paperclip, Smile } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: number
  senderId: number
  senderName: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    senderName: "Marie Dubois",
    content: "Bonjour ! J'ai bien reçu votre proposition pour la refonte du site web.",
    timestamp: "14:25",
    isCurrentUser: false,
  },
  {
    id: 2,
    senderId: 0,
    senderName: "Vous",
    content: "Parfait ! Avez-vous eu le temps de l'examiner en détail ?",
    timestamp: "14:26",
    isCurrentUser: true,
  },
  {
    id: 3,
    senderId: 1,
    senderName: "Marie Dubois",
    content: "Oui, c'est très intéressant. J'aimerais discuter de quelques points avec vous.",
    timestamp: "14:28",
    isCurrentUser: false,
  },
  {
    id: 4,
    senderId: 0,
    senderName: "Vous",
    content: "Bien sûr ! Nous pouvons organiser un appel ou une réunion selon votre préférence.",
    timestamp: "14:30",
    isCurrentUser: true,
  },
  {
    id: 5,
    senderId: 1,
    senderName: "Marie Dubois",
    content: "Parfait, on peut programmer la réunion pour demain ?",
    timestamp: "14:32",
    isCurrentUser: false,
  },
]

const contacts = {
  1: { name: "Marie Dubois", company: "TechCorp", isOnline: true },
  2: { name: "Jean Martin", company: "InnovateLtd", isOnline: true },
  3: { name: "Sophie Laurent", company: "StartupXYZ", isOnline: false },
  4: { name: "Pierre Durand", company: "GlobalTech", isOnline: false },
}

interface ChatWindowProps {
  selectedContact: number | null
}

export function ChatWindow({ selectedContact }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const contact = selectedContact ? contacts[selectedContact as keyof typeof contacts] : null

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: Message = {
      id: messages.length + 1,
      senderId: 0,
      senderName: "Vous",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      isCurrentUser: true,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulation d'une réponse automatique
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        senderId: selectedContact,
        senderName: contact?.name || "Contact",
        content: "Message reçu ! Je vous réponds dès que possible.",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: false,
      }
      setMessages((prev) => [...prev, autoReply])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!selectedContact || !contact) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez une conversation</h3>
          <p className="text-muted-foreground">Choisissez un contact pour commencer à discuter</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du chat */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {contact.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">
              {contact.company} • {contact.isOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir le profil</DropdownMenuItem>
              <DropdownMenuItem>Archiver la conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Bloquer le contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="pr-10"
            />
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
