import type { RefObject } from 'react';
import type { TFunction } from 'i18next';
import { Loader2, Send } from 'lucide-react';
import type { ChatMsg } from '@/features/game/ship/shipTypes';
import { Button, Input, ScrollArea } from '@/features/game/ship/ShipUi';

type Props = {
  chatMessages: ChatMsg[];
  chatEndRef: RefObject<HTMLDivElement | null>;
  chatInput: string;
  setChatInput: (v: string) => void;
  sendChat: () => void | Promise<void>;
  chatBootstrapping: boolean;
  t: TFunction;
};

export function ShipViewChatTab({
  chatMessages,
  chatEndRef,
  chatInput,
  setChatInput,
  sendChat,
  chatBootstrapping,
  t,
}: Props) {
  const sendDisabled = !chatInput.trim() || chatBootstrapping;

  return (
    <div className="relative flex h-[min(400px,calc(100svh-14rem))] flex-col">
      <h2 className="mb-3 font-heading text-lg font-bold text-foreground">
        {String(t('shipPage.chatTitle'))}
      </h2>
      <ScrollArea className="mb-3 flex-1 pr-2">
        <div className="space-y-2">
          {chatMessages.map((msg) =>
            msg.kind === 'system' ? (
              <div
                key={msg.id}
                className="w-full rounded-md border border-dashed border-border/80 bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground"
              >
                <div className="mb-0.5 text-[10px] uppercase tracking-wide text-muted-foreground/80">
                  {msg.time} · {String(t('shipPage.chatSystemAuthor'))}
                </div>
                <p className="text-foreground/90">{msg.text}</p>
              </div>
            ) : (
              <div
                key={msg.id}
                className={`w-full rounded-md border px-3 py-2 text-sm ${
                  msg.isOwn
                    ? 'border-primary/25 bg-primary/10'
                    : 'border-border bg-muted/50'
                }`}
              >
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-xs font-bold text-primary">{msg.author}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="break-words text-left text-foreground">{msg.text}</p>
                {msg.pending ? (
                  <p className="mt-1 text-left text-[10px] italic text-muted-foreground">{String(t('sending'))}</p>
                ) : null}
              </div>
            )
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          className="flex-1"
          placeholder={String(t('shipPage.chatPlaceholder'))}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          disabled={chatBootstrapping}
        />
        <Button size="icon" onClick={sendChat} disabled={sendDisabled}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {chatBootstrapping ? (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-md bg-background/85 backdrop-blur-sm"
          aria-busy
          aria-live="polite"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
          <p className="px-4 text-center text-sm font-medium text-foreground">
            {String(t('shipPage.chatLoading'))}
          </p>
        </div>
      ) : null}
    </div>
  );
}
