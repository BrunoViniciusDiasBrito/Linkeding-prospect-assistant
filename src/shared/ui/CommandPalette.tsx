import { useMemo, useState } from 'react';
import { Dialog } from './Dialog';
import { Input } from './Input';

type Command = { id: string; label: string; shortcut?: string; onSelect: () => void };

export function CommandPalette({ open, onOpenChange, commands }: { open: boolean; onOpenChange: (open: boolean) => void; commands: Command[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())), [commands, query]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Command palette" description="Busque ações e navegue sem sair do teclado.">
      <Input autoFocus placeholder="Digite um comando..." value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border bg-muted/30 p-1">
        {filtered.map((command) => (
          <button key={command.id} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground" onClick={() => { command.onSelect(); onOpenChange(false); }}>
            <span>{command.label}</span>{command.shortcut ? <kbd className="rounded border bg-background px-2 py-0.5 text-xs text-muted-foreground">{command.shortcut}</kbd> : null}
          </button>
        ))}
        {!filtered.length ? <p className="px-3 py-6 text-center text-sm text-muted-foreground">Nenhum comando encontrado.</p> : null}
      </div>
    </Dialog>
  );
}
