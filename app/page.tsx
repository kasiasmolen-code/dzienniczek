export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6 flex flex-col gap-6 max-w-sm mx-auto">
      {/* Header jak w referencji */}
      <div className="pt-8">
        <h1 className="text-5xl font-black text-foreground leading-tight">
          Dzien<br />niczek
        </h1>
        <p className="text-muted text-sm mt-1">Twoje notatki · 3 wpisy</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        <button className="flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap">
          Wszystkie
          <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-xs font-bold">3</span>
        </button>
        <button className="px-5 py-2 rounded-full border border-foreground/20 text-foreground text-sm whitespace-nowrap">
          Ważne
        </button>
        <button className="px-5 py-2 rounded-full border border-foreground/20 text-foreground text-sm whitespace-nowrap">
          Do zrobienia
        </button>
      </div>

      {/* Test: kremowa karta (surface) */}
      <div className="bg-surface text-surface-foreground p-6 rounded-3xl shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold">Plan na dziś</h2>
          <span className="text-2xl">😄</span>
        </div>
        <p className="text-sm text-muted mb-3">2 godziny temu</p>
        <p className="text-base leading-relaxed">
          Rano bieganie, potem praca nad projektem Dzienniczek...
        </p>
        <div className="flex gap-2 mt-4">
          <span className="bg-black/10 text-surface-foreground px-3 py-1 rounded-full text-xs font-medium">#projekt</span>
          <span className="bg-black/10 text-surface-foreground px-3 py-1 rounded-full text-xs font-medium">#sport</span>
        </div>
      </div>

      {/* Test: kolorowe karty */}
      <div className="bg-card-orange text-white p-6 rounded-3xl">
        <h2 className="text-xl font-bold">Pomysły</h2>
        <p className="text-sm opacity-80 mt-1">Wczoraj · 🙂</p>
      </div>

      <div className="bg-card-yellow text-surface-foreground p-6 rounded-3xl">
        <h2 className="text-xl font-bold">Design System Test</h2>
        <p className="text-sm opacity-70 mt-1">3 dni temu · 😐</p>
        <p className="mt-2 text-sm">Poppins Black ✓ · rounded-3xl ✓ · oklch kolory ✓</p>
      </div>

      {/* Folder grupowy jak w referencji */}
      <div className="bg-surface text-surface-foreground p-4 rounded-3xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-card-green flex items-center justify-center text-xl">🌱</div>
          <div>
            <p className="text-xs text-muted">5 wpisów</p>
            <p className="font-semibold text-sm">Moje refleksje</p>
          </div>
        </div>
        <button className="text-muted">♡</button>
      </div>

      {/* FAB button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button className="w-16 h-16 bg-foreground text-background rounded-full text-3xl font-light shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
          +
        </button>
      </div>

      {/* Padding na FAB */}
      <div className="h-24" />
    </main>
  );
}
