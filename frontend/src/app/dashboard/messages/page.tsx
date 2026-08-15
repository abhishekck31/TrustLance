"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { 
  Search, Send, Paperclip, MoreVertical, Phone, Video, 
  Circle, CheckCheck, Clock, MessageSquare 
} from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  address: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  jobTitle: string;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    address: "0x4F...3B1a",
    avatar: "E",
    lastMessage: "The milestone deliverables look great! Approving now.",
    lastTime: "2m ago",
    unread: 2,
    online: true,
    jobTitle: "Full-Stack Web3 App",
    messages: [
      { id: "m1", sender: "them", text: "Hey! I've reviewed the smart contract integration for milestone 2.", timestamp: "10:30 AM", read: true },
      { id: "m2", sender: "me", text: "Great, let me know if the escrow deposit flow looks correct. I added the withdrawal pattern as discussed.", timestamp: "10:35 AM", read: true },
      { id: "m3", sender: "them", text: "Yes, the withdrawal pattern implementation is solid. I tested it on Amoy testnet.", timestamp: "10:42 AM", read: true },
      { id: "m4", sender: "me", text: "Perfect. I've also added event emission for all state transitions so the frontend can index them.", timestamp: "10:45 AM", read: true },
      { id: "m5", sender: "them", text: "The milestone deliverables look great! Approving now.", timestamp: "10:50 AM", read: false },
      { id: "m6", sender: "them", text: "Funds will be released to your wallet shortly 🎉", timestamp: "10:51 AM", read: false },
    ],
  },
  {
    id: "2",
    name: "Marcus Chen",
    address: "0x9A...11fC",
    avatar: "M",
    lastMessage: "Can we schedule a call to discuss the audit scope?",
    lastTime: "1h ago",
    unread: 1,
    online: true,
    jobTitle: "Smart Contract Audit",
    messages: [
      { id: "m1", sender: "them", text: "Hi, I saw your profile and your audit work on OpenZeppelin contracts. Impressive!", timestamp: "9:00 AM", read: true },
      { id: "m2", sender: "me", text: "Thanks Marcus! Happy to help. What contracts need auditing?", timestamp: "9:15 AM", read: true },
      { id: "m3", sender: "them", text: "We have a DeFi lending protocol — about 1,200 lines of Solidity. The escrow has been funded with 5,000 USDC.", timestamp: "9:20 AM", read: true },
      { id: "m4", sender: "them", text: "Can we schedule a call to discuss the audit scope?", timestamp: "9:25 AM", read: false },
    ],
  },
  {
    id: "3",
    name: "Sarah Kim",
    address: "0x22...55dB",
    avatar: "S",
    lastMessage: "Love the final logo! Left a 5-star review ⭐",
    lastTime: "2d ago",
    unread: 0,
    online: false,
    jobTitle: "Logo & Branding Design",
    messages: [
      { id: "m1", sender: "them", text: "Hi! I need a logo for my new DAO project. Thinking minimal + futuristic.", timestamp: "Mon", read: true },
      { id: "m2", sender: "me", text: "I'd love to work on this. Let me prepare 3 initial concepts for you.", timestamp: "Mon", read: true },
      { id: "m3", sender: "me", text: "Here are the 3 concepts. Let me know which direction resonates!", timestamp: "Tue", read: true },
      { id: "m4", sender: "them", text: "Concept 2 is amazing! Can we iterate on that with a darker palette?", timestamp: "Tue", read: true },
      { id: "m5", sender: "me", text: "Done! Final version attached. Milestone submitted for your approval.", timestamp: "Wed", read: true },
      { id: "m6", sender: "them", text: "Love the final logo! Left a 5-star review ⭐", timestamp: "Thu", read: true },
    ],
  },
  {
    id: "4",
    name: "DevDAO Collective",
    address: "0xBB...77eA",
    avatar: "D",
    lastMessage: "Governance proposal #12 has been submitted for voting.",
    lastTime: "5d ago",
    unread: 0,
    online: false,
    jobTitle: "DAO Infrastructure",
    messages: [
      { id: "m1", sender: "them", text: "Welcome to the DevDAO collective chat! We're looking for Solidity devs for our governance module.", timestamp: "Last Week", read: true },
      { id: "m2", sender: "me", text: "I've built governance contracts with quadratic voting before. Happy to contribute.", timestamp: "Last Week", read: true },
      { id: "m3", sender: "them", text: "Governance proposal #12 has been submitted for voting.", timestamp: "5d ago", read: true },
    ],
  },
];

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string>(conversations[0].id);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeChat = conversations.find((c) => c.id === activeConversation)!;
  const filteredConversations = conversations.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In production, this would call the backend API
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex gap-0 animate-in fade-in slide-in-from-bottom-4 duration-500 -m-8">
      
      {/* Conversation List Sidebar */}
      <div className="w-80 border-r border-border flex flex-col bg-background/50 shrink-0">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-surface border border-border rounded-xl py-2 pl-9 pr-4 outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left p-4 flex gap-3 hover:bg-white/5 transition-all border-b border-border/50 ${
                activeConversation === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
                  activeConversation === conv.id
                    ? "bg-gradient-to-br from-primary to-accent text-white"
                    : "bg-white/10 text-gray-300"
                }`}>
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`font-medium text-sm truncate ${conv.unread > 0 ? "text-white" : "text-gray-300"}`}>
                    {conv.name}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0 ml-2">{conv.lastTime}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 truncate">{conv.jobTitle}</p>
                <p className={`text-xs truncate ${conv.unread > 0 ? "text-gray-300 font-medium" : "text-gray-500"}`}>
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {conv.unread > 0 && (
                <div className="shrink-0 self-center">
                  <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {conv.unread}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Chat Header */}
        <div className="h-[72px] border-b border-border flex items-center justify-between px-6 bg-background/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                {activeChat.avatar}
              </div>
              {activeChat.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{activeChat.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {activeChat.online ? (
                  <><Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online</>
                ) : (
                  <><Clock className="w-3 h-3" /> Last seen recently</>
                )}
                <span className="mx-1">·</span>
                <span className="font-mono">{activeChat.address}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job Context Bar */}
        <div className="px-6 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
          <span className="text-xs text-primary font-medium">
            📋 Job: {activeChat.jobTitle}
          </span>
          <span className="text-xs text-gray-500 font-mono">{activeChat.address}</span>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "me"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-md"
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1.5 ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}>
                  <span className={`text-[10px] ${msg.sender === "me" ? "text-white/60" : "text-gray-500"}`}>
                    {msg.timestamp}
                  </span>
                  {msg.sender === "me" && (
                    <CheckCheck className={`w-3 h-3 ${msg.read ? "text-blue-300" : "text-white/40"}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Composer */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-surface border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-xl transition-all shrink-0 ${
                newMessage.trim()
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
