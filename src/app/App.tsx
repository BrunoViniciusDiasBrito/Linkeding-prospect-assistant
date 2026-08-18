import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CommandPalette, Input, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, ToastProvider, useToast } from '../shared/ui';
import { ThemeProvider, useTheme } from './theme-provider';

const pages = ['Dashboard', 'Prospects', 'Automação', 'Relatórios'];

function Shell() {
  const [activePage, setActivePage] = useState(pages[0]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const commands = useMemo(() => [
    ...pages.map((page, index) => ({ id: page, label: `Ir para ${page}`, shortcut: `G ${index + 1}`, onSelect: () => setActivePage(page) })),
    { id: 'theme', label: 'Alternar tema', shortcut: '⌘ J', onSelect: toggleTheme },
  ], [toggleTheme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === 'k') { event.preventDefault(); setPaletteOpen((open) => !open); }
      if ((event.metaKey || event.ctrlKey) && key === 'j') { event.preventDefault(); toggleTheme(); }
      if (key === 'g') return;
      if (event.altKey && ['1', '2', '3', '4'].includes(key)) { event.preventDefault(); setActivePage(pages[Number(key) - 1]); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleTheme]);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent))_0,transparent_34rem)] opacity-70" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[16rem_1fr]">
        <aside className="border-b bg-background/70 p-4 backdrop-blur-xl lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">L</span><div><p className="text-sm font-semibold">Linkeding</p><p className="text-xs text-muted-foreground">Prospect OS</p></div></div>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>{theme}</Button>
          </div>
          <nav className="space-y-1">
            {pages.map((page, index) => <button key={page} onClick={() => setActivePage(page)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${activePage === page ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'}`}><span>{page}</span><kbd className="text-xs">⌥{index + 1}</kbd></button>)}
          </nav>
        </aside>
        <section className="p-5 sm:p-8">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm text-muted-foreground">Workspace / {activePage}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Camada visual base</h1></div>
            <Button variant="outline" onClick={() => setPaletteOpen(true)}>⌘K Command palette</Button>
          </header>
          <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            <Card><CardHeader><CardTitle>Pipeline minimalista</CardTitle><CardDescription>Cards, tabela e inputs compartilhados no padrão shadcn-like.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Prospect</TableHead><TableHead>Status</TableHead><TableHead>Score</TableHead></TableRow></TableHeader><TableBody>{['Ana Ribeiro','Bruno Lima','Carla Torres'].map((name, index) => <TableRow key={name}><TableCell className="font-medium">{name}</TableCell><TableCell>{['Novo','Contato','Reunião'][index]}</TableCell><TableCell>{92 - index * 8}%</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
            <Card><CardHeader><CardTitle>Nova busca</CardTitle><CardDescription>Interface limpa para iniciar fluxos de prospecção.</CardDescription></CardHeader><CardContent className="space-y-3"><Input placeholder="Cargo, empresa ou segmento" /><Select options={[{ label: 'LinkedIn Sales', value: 'sales' }, { label: 'Google', value: 'google' }]} /><Textarea placeholder="Notas para automação" /><Button className="w-full" onClick={() => toast({ title: 'Busca preparada', description: 'A camada visual e o toast estão funcionando.' })}>Criar busca</Button></CardContent></Card>
          </div>
        </section>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} commands={commands} />
    </main>
  );
}

export function App() {
  return <ThemeProvider><ToastProvider><Shell /></ToastProvider></ThemeProvider>;
}
