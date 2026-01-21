import { useCountStore } from '../model/store/countStore'

function App() {
  const { count, increment, decrement } = useCountStore()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Vite + React + Zustand
          </h1>
          <p className="text-muted-foreground">
            Tailwind CSS & shadcn/ui configured
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="text-6xl font-bold text-primary mb-4">{count}</div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={decrement}
              className="px-6 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              Decrement
            </button>
            <button
              onClick={increment}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              Increment
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Edit <code className="bg-muted px-2 py-1 rounded">src/App.tsx</code> to get started
        </p>
      </div>
    </div>
  )
}

export default App
