export default function EditEntry({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-black text-foreground">Edytuj wpis #{params.id}</h1>
      <p className="text-muted mt-2">— Phase 2</p>
    </main>
  );
}
