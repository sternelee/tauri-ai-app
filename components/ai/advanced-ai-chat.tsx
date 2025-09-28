'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Bot, Loader2, Trash2, Download, Copy, Check } from 'lucide-react';
import { Message } from './message';
import { ChatInput } from './chat-input';
import { PromptSuggestions } from './prompt-suggestions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdvancedAIChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setInput,
    setMessages,
  } = useChat({
    api: '/api/chat',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleCopyChat = async () => {
    const chatText = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(chatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportChat = () => {
    const chatText = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyChat}
                  title="Copy chat"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExportChat}
                  title="Export chat"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-8">
              <Bot className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h2>
              <p className="text-muted-foreground">
                Start a conversation or try one of the suggestions below
              </p>
            </div>
            <PromptSuggestions onSelectPrompt={handlePromptSelect} />
          </div>
        ) : (
          <div className="px-4 py-6">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[80%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="rounded-lg px-4 py-3 bg-destructive/10 text-destructive max-w-md">
                    <p className="text-sm font-medium">Error</p>
                    <p className="text-xs mt-1">{error.message}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reload()}
                      className="mt-2"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t bg-card">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleFormSubmit}>
            <ChatInput
              onSubmit={(message) => {
                setInput(message);
                const syntheticEvent = {
                  preventDefault: () => {},
                } as React.FormEvent;
                handleSubmit(syntheticEvent);
              }}
              isLoading={isLoading}
              placeholder="Ask me anything..."
            />
          </form>
          {isLoading && (
            <div className="px-4 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={stop}
                className="text-xs"
              >
                Stop generating
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}