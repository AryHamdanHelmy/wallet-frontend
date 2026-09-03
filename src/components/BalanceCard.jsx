import { formatRupiah } from '../utils/format'

export default function BalanceCard({ balance, loading, error, onRefresh }) {
  const isEmpty = !loading && !error && Number(balance) === 0
  return (
    <div className="rounded-2xl bg-linear-to-br from-primaryDark to-primary p-6 text-white shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-white/70">Your balance</p>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-full px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          {loading ? 'Processing...' : 'Refresh'}
        </button>
      </div>

      <p
        aria-live="polite"
        className="mt-2 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl"
      >
        {loading && balance === null ? (
          <span className="inline-block h-9 w-44 animate-pulse rounded bg-white/20 sm:h-10" />
        ) : error ? (
          <span className="text-white/50">—</span>
        ) : (
          formatRupiah(balance)
        )}
      </p>

      {error ? (
        <p className="mt-4 text-xs text-white/80">
          Couldn&apos;t load your balance. Tap Refresh to try again.
        </p>
      ) : isEmpty ? (
        <p className="mt-4 text-xs text-white/60">
          No balance yet. Start with a top-up below.
        </p>
      ): null}
    </div>
  )
}