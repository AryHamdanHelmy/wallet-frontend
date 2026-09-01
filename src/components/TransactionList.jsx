import { formatRupiah, formatTanggal } from '../utils/format'

function LabelTransaction({ trx }) {
  if (trx.type === 'topup') return 'Top-up balance'

  const name = trx.counterparty?.name ?? trx.counterparty?.username ?? 'Other user'
  return trx.direction === 'out' ? `Send to ${name}` : `Accept from ${name}`
}

export default function TransactionList({ transactions, loading, error, onRetry }) {
  if (loading && transactions.length === 0) {
    return (
      <div className="rounded-xl border border-[#e3e7eb] bg-white p-5">
        <h2 className="mb-4 text-base font-medium text-[#2c2e2f]">
          Transaction history
        </h2>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#e3e7eb] bg-white p-5">
        <h2 className="mb-3 text-base font-medium text-[#2c2e2f]">
          Transaction history
        </h2>
        <p className="text-sm text-[#d20000]">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-[#e3e7eb] px-4 py-1.5 text-sm text-[#0070ba] transition hover:border-[#0070ba]"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#e3e7eb] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-[#2c2e2f]">
          Transaction history
        </h2>
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#0070ba]" />
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#687173]">
          No transactions. Top up your balance to start.
        </p>
      ) : (
        <ul className="divide-y divide-[#e3e7eb]">
          {transactions.map((trx) => (
            <li key={trx.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#2c2e2f]">
                  <LabelTransaction trx={trx} />
                </p>
                <p className="mt-0.5 text-xs text-[#687173]">
                  {formatTanggal(trx.created_at)}
                </p>
                {trx.description && (
                  <p className="mt-0.5 truncate text-xs text-[#687173]">
                    {trx.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right">
                <p
                  className={`text-sm font-medium ${
                    trx.direction === 'in' ? 'text-[#00a67e]' : 'text-[#2c2e2f]'
                  }`}
                >
                  {trx.amount_formatted ??
                    (trx.direction === 'out' ? '-' : '+') + formatRupiah(trx.amount)}
                </p>
                <p className="mt-0.5 text-xs text-[#687173]">
                  Balance {formatRupiah(trx.balance_after)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}