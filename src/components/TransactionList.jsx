import { formatRupiah, formatTanggal } from '../utils/format'

function transactionLabel(trx) {
  if (trx.type === 'topup') return 'Top-up balance'

  const name =
    trx.counterparty?.name ?? trx.counterparty?.username ?? 'another user'
  return trx.direction === 'out' ? `Sent to ${name}` : `Received from ${name}`
}

function Panel({ children }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">{children}</div>
  )
}

export default function TransactionList({
  transactions,
  loading,
  error,
  onRetry,
}) {
  if (loading && transactions.length === 0) {
    return (
      <Panel>
        <h2 className="mb-4 text-title text-textPrimary">Transaction history</h2>
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
      </Panel>
    )
  }

  if (error) {
    return (
      <Panel>
        <h2 className="mb-3 text-title text-textPrimary">Transaction history</h2>
        <p className="text-sm text-danger">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-line px-4 py-1.5 text-sm text-primary transition hover:border-primary"
        >
          Try again
        </button>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-title text-textPrimary">Transaction history</h2>
        {loading && (
          <span
            role="status"
            aria-label="Refreshing transactions"
            className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary"
          />
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-textSecondary">
          No transactions yet. Top up your balance to start.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {transactions.map((trx) => (
            <li
              key={trx.id}
              className="flex items-start justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-textPrimary">
                  {transactionLabel(trx)}
                </p>
                <p className="mt-0.5 text-xs text-textSecondary">
                  {formatTanggal(trx.created_at)}
                </p>
                {trx.description && (
                  <p className="mt-0.5 truncate text-xs text-textSecondary">
                    {trx.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right">
                <p
                  className={`text-sm font-medium tabular-nums ${
                    trx.direction === 'in' ? 'text-success' : 'text-textPrimary'
                  }`}
                >
                  {trx.direction === 'out' ? '−' : '+'}
                  {formatRupiah(trx.amount)}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-textSecondary">
                  Balance {formatRupiah(trx.balance_after)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}