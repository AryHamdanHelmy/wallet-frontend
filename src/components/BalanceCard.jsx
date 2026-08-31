import { formatRupiah } from '../utils/format'

export default function BalanceCard({ balance, loading, onRefresh }) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-[#003087] to-[#0070ba] p-6 text-white shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-white/70">Saldo Anda</p>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-full px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          {loading ? 'Memuat...' : 'Perbarui'}
        </button>
      </div>

      <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {loading && balance === null ? (
          <span className="inline-block h-9 w-40 animate-pulse rounded bg-white/20" />
        ) : (
          formatRupiah(balance)
        )}
      </p>

      <p className="mt-4 text-xs text-white/60">
        Saldo diperbarui otomatis setiap transaksi berhasil
      </p>
    </div>
  )
}