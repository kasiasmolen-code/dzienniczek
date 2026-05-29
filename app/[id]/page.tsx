export default function EntryDetails({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-surface p-6">
      <h1 className="text-4xl font-black text-surface-foreground">Wpis #{params.id}</h1>
      <p className="text-muted mt-2">— Phase 2</p>
    </main>
  );
}
