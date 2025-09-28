'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Type your message...',
  className,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24;
      const maxRows = 5;
      const newRows = Math.min(Math.floor(scrollHeight / lineHeight), maxRows);
      setRows(newRows);
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
      setRows(1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('flex items-end space-x-2 p-4', className)}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={rows}
          className="w-full px-4 py-2 pr-12 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          style={{ minHeight: '44px' }}
        />
        <div className="absolute right-2 bottom-2 flex space-x-1">
          <button
            type="button"
            className="p-1 rounded hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <Mic className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !input.trim()}
        size="icon"
        className="rounded-full"
      >
        {isLoading ? (
          <StopCircle className="h-4 w-4" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}