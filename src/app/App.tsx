export function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center px-6 py-16">
        <p className="mb-3 rounded-full border border-cyan-400/30 px-3 py-1 text-sm text-cyan-200">
          Tauri v2 · React · TypeScript
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Linkeding Prospect Assistant
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Base inicial do assistente de prospecção com Feature Slice Design,
          Tailwind CSS e backend Rust preparado para comandos, serviços e automação.
        </p>
      </section>
    </main>
  );
}
