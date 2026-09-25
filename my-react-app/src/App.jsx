import { useState } from 'react'

function formatTypeList(types) {
  return types.map((type) => type[0].toUpperCase() + type.slice(1)).join(', ')
}

function formatMatchup(matchup) {
  if (matchup.error) {
    return matchup.error
  }

  const typesThatResist = formatTypeList(matchup.half_damage_to)
  const superEffectiveMoves = formatTypeList(matchup.double_damage_from)

  return `To defend: ${typesThatResist} Pokémon take half damage from the opponent's attacks. To attack: ${superEffectiveMoves} moves deal double damage to the opponent.`
}

function App() {
  const [matchup, setMatchup] = useState(null)


  const types = [
    { name: 'Fire', color: 'bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-400' },
    { name: 'Water', color: 'bg-sky-500 hover:bg-sky-600 focus-visible:ring-sky-400' },
    { name: 'Grass', color: 'bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-400' },
    { name: 'Ground', color: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-400' },
  ]

  async function getMatchup(type) {
    try {
      const response = await fetch(
        `http://localhost:5001/api/type/${encodeURIComponent(type)}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to retrieve matchup data.')
      }

      return data
    } catch (error) {
      console.error('Could not retrieve matchup data:', error)
      return { error: 'Could not retrieve matchup data. Is the backend running?' }
    }
  }

  async function handleTypeClick(type) {
    const response = await getMatchup(type)
    setMatchup(response)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 text-slate-900">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-red-500 px-6 py-4 text-white">
          <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-slate-900 shadow-[inset_0_0_0_5px_white]" aria-hidden="true" />
          <p className="text-sm font-bold tracking-wide">BATTLE ASSISTANT</p>
        </div>

        <div className="p-6">
          <p className="text-sm font-medium text-slate-500">Choose the opposing Pokémon’s type.</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">What are you fighting?</h1>

          <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Pokémon type options">
            {types.map((type) => (
              <button
                key={type.name}
                type="button"
                onClick={() => handleTypeClick(type.name)}
                className={`rounded-lg px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${type.color}`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {matchup && (
            <p className="mt-5 text-sm leading-6 text-slate-600" aria-live="polite">
              {formatMatchup(matchup)}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
