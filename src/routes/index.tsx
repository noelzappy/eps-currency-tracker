import { createFileRoute } from '@tanstack/react-router'
import { CurrencyTracker } from '@/components/CurrencyTracker'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-sky-900 flex flex-col items-center pt-20 px-4 w-full overflow-x-hidden">
      <CurrencyTracker />
    </div>
  )
}
