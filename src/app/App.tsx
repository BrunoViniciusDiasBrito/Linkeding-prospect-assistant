import { buildReportDashboard } from '../features/reports';

const sampleProfiles = [
  { id: '1', searchId: 's1', name: 'Ana Silva', title: 'Head of Sales', company: 'Acme', location: 'São Paulo', profileUrl: 'https://www.linkedin.com/in/ana', score: 85, reviewStatus: 'approved' as const, createdAt: new Date().toISOString() },
  { id: '2', searchId: 's1', name: 'Bruno Costa', title: 'Recruiter', company: 'Beta', location: 'Lisboa', profileUrl: 'https://www.linkedin.com/in/bruno', score: 62, reviewStatus: 'pending' as const, createdAt: new Date().toISOString() },
];

export function App() {
  const metrics = buildReportDashboard(sampleProfiles);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16">
        <p className="w-fit rounded-full border border-cyan-400/30 px-3 py-1 text-sm text-cyan-200">
          Tauri v2 · React · TypeScript
        </p>
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">LinkedIn Prospect Assistant</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Fluxos principais para salvar pesquisas, abrir URLs do LinkedIn em janela integrada,
            extrair dados visíveis, pontuar perfis, revisar leads e exportar relatórios.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Perfis analisados" value={metrics.analyzedProfiles} />
          <Metric label="Aprovados" value={metrics.approved} />
          <Metric label="Rejeitados" value={metrics.rejected} />
          <Metric label="Score médio" value={metrics.averageScore} />
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-sm text-slate-400">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>;
}
