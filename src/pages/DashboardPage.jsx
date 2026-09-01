import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { walletApi } from '../api/wallet'
import { getErrorMessage } from '../api/errors'
import BalanceCard from '../components/BalanceCard'
import TopupForm from '../components/TopupForm'
import TransferForm from '../components/TransferForm'
import TransactionList from '../components/TransactionList'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [balance, setBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(true)

  const [transactions, setTransactions] = useState([])
  const [trxLoading, setTrxLoading] = useState(true)
  const [trxError, setTrxError] = useState('')

  const [loggingOut, setLoggingOut] = useState(false)

  const muatSaldo = useCallback(async () => {
    setBalanceLoading(true)
    try {
      const res = await walletApi.getBalance()
      setBalance(res.data.data.balance)
    } catch {
      // interceptor sudah menangani 401; error lain diabaikan agar UI tetap hidup
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  const muatTransaksi = useCallback(async () => {
    setTrxLoading(true)
    setTrxError('')
    try {
      const res = await walletApi.getTransactions()
      setTransactions(res.data.data.data ?? [])
    } catch (error) {
      setTrxError(getErrorMessage(error))
    } finally {
      setTrxLoading(false)
    }
  }, [])

  useEffect(() => {
    muatSaldo()
    muatTransaksi()
  }, [muatSaldo, muatTransaksi])

  const setelahTransaksi = () => {
    muatSaldo()
    muatTransaksi()
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <header className="border-b border-[#e3e7eb] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
          <span className="text-lg font-semibold text-[#003087]">MiniWallet</span>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#687173] sm:inline">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-[#e3e7eb] px-3.5 py-1.5 text-sm text-[#2c2e2f] transition hover:border-[#0070ba] hover:text-[#0070ba] disabled:opacity-50"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5">
        <BalanceCard
          balance={balance}
          loading={balanceLoading}
          onRefresh={muatSaldo}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TopupForm onSuccess={setelahTransaksi} />
          <TransferForm onSuccess={setelahTransaksi} />
        </div>

        <TransactionList
          transactions={transactions}
          loading={trxLoading}
          error={trxError}
          onRetry={muatTransaksi}
        />
      </main>
    </div>
  )
}