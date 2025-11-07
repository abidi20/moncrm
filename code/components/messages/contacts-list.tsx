"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Contact {
  id: number
  name: string
  company: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  avatar?: string
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Marie Dubois",
    company: "TechCorp",
    lastMessage: "Parfait, on peut programmer la réunion pour demain ?",
    lastMessageTime: "14:32",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Jean Martin",
    company: "InnovateLtd",
    lastMessage: "J'ai reçu votre proposition, je l'étudie",
    lastMessageTime: "12:15",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 3,
    name: "Sophie Laurent",
    company: "StartupXYZ",
    lastMessage: "Merci pour la démonstration !",
    lastMessageTime: "Hier",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: 4,
    name: "Pierre Durand",
    company: "GlobalTech",
    lastMessage: "Pouvez-vous m'envoyer plus d'informations ?",
    lastMessageTime: "Hier",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 5,
    name: "Alice Bernard",
    company: "DevCorp",
    lastMessage: "La formation était excellente, merci !",
    lastMessageTime: "2 jours",
    unreadCount: 0,
    isOnline: true,
  },
]

interface ContactsListProps {
  selectedContact: number | null
  onSelectContact: (contactId: number) => void
}

export function ContactsList({ selectedContact, onSelectContact }: ContactsListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Conversations</h3>
        <p className="text-sm text-muted-foreground">{mockContacts.length} contacts</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {mockContacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                selectedContact === contact.id && "bg-primary/10 border border-primary/20",
              )}
              onClick={() => onSelectContact(contact.id)}
            >
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

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                    {contact.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="bg-primary text-primary-foreground text-xs h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
