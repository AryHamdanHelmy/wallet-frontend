import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { walletApi } from '../api/wallet'
import { getErrorMessage } from '../api/errors'
import BalanceCard from '../components/BalanceCard'
import TopupForm from '../components/TopupForm'
import TransferForm from '../components/TransferForm'
import TransactionList from '../components/TransactionList'
import logoFull from '../assets/logo-full.svg'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [balance, setBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [balanceError, setBalanceError] = useState('')

  const [transactions, setTransactions] = useState([])
  const [trxLoading, setTrxLoading] = useState(true)
  const [trxError, setTrxError] = useState('')

  const [loggingOut, setLoggingOut] = useState(false)

  const loadBalance = useCallback(async () => {
    setBalanceLoading(true)
    setBalanceError('')
    try {
      const res = await walletApi.getBalance()
      setBalance(res.data.data.balance)
    } catch (error) {
      // The interceptor already handles 401. Other errors are surfaced so the
      // user knows the balance failed to load, rather than assuming it's zero.
      setBalanceError(getErrorMessage(error))
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  const loadTransaction = useCallback(async () => {
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
    loadBalance()
    loadTransaction()
  }, [loadBalance, loadTransaction])

  const afterTransaction = () => {
    loadBalance()
    loadTransaction()
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
          <img src={logoFull} alt="Koku" className="h-7 w-auto" />

          <div className="flex items-center gap-4">
            <span className="hidden text-title text-textSecondary sm:inline">
              {user?.username}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-title text-textSecondary transition hover:text-textPrimary disabled:opacity-50"
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5">
        <BalanceCard
          balance={balance}
          loading={balanceLoading}
          error={balanceError}
          onRefresh={loadBalance}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TopupForm onSuccess={afterTransaction} />
          <TransferForm balance={balance} onSuccess={afterTransaction} />
        </div>

        <TransactionList
          transactions={transactions}
          loading={trxLoading}
          error={trxError}
          onRetry={loadTransaction}
        />
      </main>
    </div>
  )
}