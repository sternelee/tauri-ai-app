'use client';

import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptSuggestion {
  title: string;
  prompt: string;
}

const suggestions: PromptSuggestion[] = [
  {
    title: 'Explain a concept',
    prompt: 'Can you explain quantum computing in simple terms?',
  },
  {
    title: 'Write code',
    prompt: 'Write a Python function to calculate the Fibonacci sequence',
  },
  {
    title: 'Creative writing',
    prompt: 'Write a short story about a time traveler in ancient Rome',
  },
  {
    title: 'Get advice',
    prompt: 'What are some tips for improving productivity while working from home?',
  },
];

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptSuggestions({ onSelectPrompt }: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6">
      <div className="col-span-full flex items-center space-x-2 mb-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="text-sm font-medium text-muted-foreground">Try these prompts</h3>
      </div>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-4 justify-start text-left hover:bg-muted"
          onClick={() => onSelectPrompt(suggestion.prompt)}
        >
          <div>
            <p className="font-medium text-sm">{suggestion.title}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {suggestion.prompt}
            </p>
          </div>
        </Button>
      ))}
    </div>
  );
}